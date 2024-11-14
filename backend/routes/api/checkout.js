const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { ShoppingCart, Order, Listing, CartItem } = require('../../db/models');
const Stripe = require('stripe');

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.get('/', requireAuth, async (req, res) => {
    const { user } = req;
    const orders = await Order.findAll({
        where: {
            buyerId: user.id
        }
    });
    if (!user) return res.status(403).json({ message: "Forbidden" })
    if (!orders || orders.buyerId !== user.id) return res.status(403).json({ message: "Forbidden" })

    return res.json(orders)
});

router.post('/', requireAuth, async (req, res) => {
    try {

        const { user } = req
        const { cartId, firstName, lastName, address, city, state, zipCode, subTotal } = req.body;

        const cart = await ShoppingCart.findOne({
            where: {
                id: cartId
            }
        })

        if (!cartId) return res.status(404).json({ message: "Cart couldn't be found" })

        if (user.id !== cart.buyerId) return res.status(403).json({ message: "Forbidden" })

        const shippingCost = 5;
        const taxRate = 0.0925

        const subTotalInCents = Math.round(subTotal * 100);
        const shippingCostInCents = Math.round(shippingCost * 100);
        const taxInCents = Math.round(subTotal * taxRate * 100);
        const orderTotalInCents = subTotalInCents + shippingCostInCents + taxInCents;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: orderTotalInCents,
            currency: 'usd',
            payment_method: 'pm_card_visa',
            payment_method_types: ['card'],
            shipping: {
                name: `${firstName} ${lastName}`,
                address: {
                    line1: address,
                    city: city,
                    state: state,
                    postal_code: zipCode,
                    country: 'US'
                }
            },
            metadata: { cartId, userId: user.id }
        })

        const order = await Order.create({
            buyerId: user.id,
            firstName,
            lastName,
            cartId,
            address,
            city,
            state,
            zipCode,
            stripePaymentIntentId: paymentIntent.id,
            paymentStatus: 'Pending',
            transactionDate: new Date(),
            subTotal: subTotalInCents,
            orderTotal: orderTotalInCents,
        });

        const cartItems = await CartItem.findAll({
            include: {
                model: Listing
            },
            where: {
                cartId: cartId
            }
        })

        cartItems.forEach(async (cartItem) => {
            let listingId = cartItem.listingId
            let cartQty = cartItem.cartQty

            const listing = await Listing.findByPk(listingId)

            let updatedQty = listing.stockQty - cartQty
            listing.set({
                stockQty: updatedQty
            })

            await listing.save();
        })

        cartItems.forEach(async (cartItem) => {
            cartItem.set({
                orderId: order.id
            })

            await cartItem.save();
        })


        return res.status(201).json({ order, clientSecret: paymentIntent.client_secret, deletedCartId: cartId })
    } catch (err) {
        return res.json(err.message)
    }

});

module.exports = router;
