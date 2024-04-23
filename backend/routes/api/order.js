const express = require('express');
const { CartItem, Order, Listing } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/:orderId', async (req, res) => {
    const orderId = Number(req.params.orderId);
    const order = Order.findByPk(orderId);

    const orderItems = await CartItem.findAll({
        include: {
            model: Listing
        },
        where: {
            orderId: orderId
        }
    })

    if (!order) return res.json(404).json({ error: 'Order ID not found' })

    return res.json(orderItems)

})

module.exports = router;
