const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { ShoppingCart, Order, Listing, CartItem } = require('../../db/models');

const router = express.Router();

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
})

// router.get('/:orderId', requireAuth, async (req, res) => {
//     const orderId = Number(req.params.orderId);

//     const { user } = req;
//     const order = await Order.findOne({
//         attributes: ['id', 'buyerId'],
//         where: {
//             id: orderId
//         }
//     });

//     if (!user) return res.status(403).json({ message: "Forbidden" })
//     if (order.buyerId !== user.id) return res.status(403).json({ message: "Forbidden" })
//     const cartItems = await CartItem.findAll({
//         include: {
//             model: Listing,
//             attributes: ['plantName'],
//         },
//         attributes: ['buyerId'],
//         where: {
//             cartId: order.cartId
//         }
//     })

//     cartItems.forEach(async (cartItem) => {
//         let listingId = cartItem.listingId
//         let cartQty = cartItem.cartQty

//         const listing = await Listing.findByPk(listingId)

//         let updatedQty = cartQty - listing.stockQty
//         listing.set({
//             stockQty: updatedQty
//         })

//         await listing.save();
//     })



//     return res.json({ Order: order, CartItems: cartItems })
// })


router.post('/', requireAuth, async (req, res) => {
    try {

        const { user } = req
        const { cartId, address, city, state, zipCode, paymentMethod, paymentDetails, subTotal, orderTotal } = req.body;

        const cart = await ShoppingCart.findOne({
            where: {
                id: cartId
            }
        })

        if (!cartId) return res.status(404).json({ message: "Cart couldn't be found" })

        if (user.id !== cart.buyerId) return res.status(403).json({ message: "Forbidden" })

        const order = await Order.create({
            buyerId: user.id,
            cartId,
            address,
            city,
            state,
            zipCode,
            paymentMethod,
            paymentDetails,
            subTotal,
            orderTotal
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


        return res.status(201).json({ order, deletedCartId: cartId })
    } catch (err) {
        return res.json(err.message)
    }

})

module.exports = router;
