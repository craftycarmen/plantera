const express = require('express');
const { CartItem, Order, Listing } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/:orderId', requireAuth, async (req, res) => {
    const orderId = Number(req.params.orderId);
    const order = await Order.findOne({
        where: {
            id: orderId
        },
        // attributes: ['buyerId']
    });
    console.log(order);
    const { user } = req;
    if (order.buyerId !== user.id) return res.status(403).json({ message: "Forbidden" })
    const orderItems = await CartItem.findAll({
        include: {
            model: Listing,
            attributes: ['plantName', 'price']
        },
        where: {
            orderId: orderId
        }
    })

    if (!order) return res.json(404).json({ error: 'Order ID not found' })

    return res.json({ Order: order, OrderItems: orderItems })

})

module.exports = router;
