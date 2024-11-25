const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { ShoppingCart, Order, Listing, CartItem } = require('../../db/models');
const Stripe = require('stripe');
const { SHIPPING_COST, TAX_RATE } = require('../../config/constants');

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
// const processedEventIds = new Set();

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
    const csrfHeader = req.headers['x-csrf-token'];
    const csrfCookie = req.cookies['XSRF-TOKEN'];

    console.log('CSRF Token from Header:', csrfHeader);
    console.log('CSRF Token from Cookie:', csrfCookie);

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

        const subTotalInCents = Math.round(subTotal * 100);
        const shippingCostInCents = Math.round(SHIPPING_COST * 100);
        const taxInCents = Math.round(subTotal * TAX_RATE * 100);
        const orderTotalInCents = subTotalInCents + shippingCostInCents + taxInCents;
        console.log("TAX IN CENTS", taxInCents);
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
                },
            },
            metadata: {
                userId: user.id
            },
            // automatic_payment_methods: { enabled: true },
            // confirm: true,
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
            transactionDate: new Date(),
            subTotal: subTotalInCents,
            orderTotal: orderTotalInCents,
            shippingCost: shippingCostInCents,
            taxAmount: taxInCents
        });

        const cartItems = await CartItem.findAll({
            include: {
                model: Listing
            },
            where: {
                cartId: cartId
            }
        })

        const listingsMetadata = cartItems.map(cartItem => ({
            listingId: cartItem.listingId,
            quantity: cartItem.cartQty
        }));

        await stripe.paymentIntents.update(paymentIntent.id, {
            metadata: {
                orderId: order.id,
                listings: JSON.stringify(listingsMetadata)
            }
        });

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


        return res.status(201).json({
            order,
            orderSummary: {
                subTotal: order.subTotal,
                shippingCost: SHIPPING_COST,
                taxAmount: taxInCents / 100,
                orderTotal: order.orderTotal
            },
            clientSecret: paymentIntent.client_secret,
            paymentIntent,
            deletedCartId: cartId
        })
    } catch (err) {
        return res.json(err.message)
    }

});

router.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    let event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
                request.body,
                signature,
                endpointSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return response.sendStatus(400);
        }
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            const orderId = paymentIntent.metadata.orderId;
            console.log('Order Id:', orderId);

            const order = async () => {
                await Order.findOne({ where: { id: orderId } });
                if (order) {
                    order.paymentStatus = 'Paid';
                    await order.save();
                    console.log(`Payment status for Order ${orderId} updated to Succeeded`);
                }
            }
            break;

        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});


// router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
//     const sig = req.headers['stripe-signature'];
//     const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
//     console.log('Raw Payload:', req.body.toString());
//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//         console.log('Stripe Signature:', req.headers['stripe-signature']);
//         console.log('Webhook Secret:', process.env.STRIPE_WEBHOOK_SECRET);
//         // if (processedEventIds.has(event.id)) {
//         //     console.log('Duplicate event detected:', event.id);
//         //     return res.status(200).json({ received: true })
//         // }

//         // processedEventIds.add(event.id);

//         if (event.type === 'payment_intent.succeeded') {
//             const paymentIntent = event.data.object;
//             console.log('Payment Intent Succeeded:', paymentIntent);

//             const orderId = paymentIntent.metadata.orderId;
//             console.log('Order Id:', orderId);

//             const order = await Order.findOne({ where: { id: orderId } });
//             if (order) {
//                 order.paymentStatus = 'Paid';
//                 await order.save();
//                 console.log(`Payment status for Order ${orderId} updated to Succeeded`);
//             }
//         }

//         res.status(200).json({ received: true })
//     } catch (error) {
//         console.error('Webhook error:', error.message);
//         res.status(400).send(`Webhook error: ${error.message}`)
//     }
// })

module.exports = router;
