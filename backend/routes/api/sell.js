const express = require('express');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { User, Image, ShoppingCart, Listing, Guide, CartItem } = require('../../db/models');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {
        let orders = await CartItem.findAll({
            where: {
                orderId: {
                    [Op.ne]: null
                }
            },
            include: {
                model: Listing,
                where: {
                    sellerId: user.id,
                },
            }
        })

        if (orders.length === 0) orders === null;

        return res.json({ ShopOrders: orders })
    }
})


module.exports = router;
