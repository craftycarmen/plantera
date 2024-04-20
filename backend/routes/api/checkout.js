const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { ShoppingCart, Order } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res) => {
    const { user } = req;

    const orders = await Order.findAll({
        where: {
            buyerId: user.id
        }
    });

    return res.json(orders)
})
router.post('/', requireAuth, async (req, res) => {
    try {

        const { user } = req
        const { cartId, address, city, state, zipCode, paymentMethod, paymentDetails, orderTotal } = req.body;

        if (!cartId) return res.status(404).json({ message: "Cart couldn't be found" })

        const cart = await ShoppingCart.findByPk(cartId)

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
            orderTotal
        })

        console.log("RESORER", res);

        return res.status(201).json(order)
    } catch (err) {
        return res.json(err.message)
    }

})

module.exports = router;
