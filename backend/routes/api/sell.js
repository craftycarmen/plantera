const express = require('express');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { User, Image, ShoppingCart, Listing, Guide, CartItem, Order } = require('../../db/models');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {
        let orderItems = await CartItem.findAll({
            where: {
                orderId: {
                    [Op.ne]: null
                }
            },
            include:
            {
                model: Listing,
                where: {
                    sellerId: user.id,
                },

            }
        })

        if (orderItems.length === 0) orderItems === null;

        return res.json({ ShopOrders: orderItems })
    }
})


module.exports = router;
