const express = require('express');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { User, Image, ShoppingCart, Listing, Guide, CartItem, Order } = require('../../db/models');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {
        const orders = await Order.findAll({
            attributes: {
                exclude: ['cartId']
            },
            include: [
                {
                    model: CartItem,
                    attributes: ['cartQty', 'orderStatus'],
                    where: {
                        orderId: {
                            [Op.ne]: null
                        }
                    },
                    include: [
                        {
                            model: Listing,
                            attributes: ['id', 'plantName', 'price', 'potSize'],
                            where: {
                                sellerId: user.id
                            }
                        }
                    ]
                }
            ]
        })

        if (orders.length === 0) orders === null;

        return res.json({ ShopOrders: orders })
    }
})

router.put('/orders/:orderId', requireAuth, async (req, res) => {
    const orderId = Number(req.params.orderId);
    const order = await Order.findOne({
        where: {
            order: orderId
        },
        include: {
            model: CartItem,
            attributes: ['cartQty', 'orderStatus'],
        }
    })

    if (!order) return res.status(404).json({ message: "Order couldn't be found" });

    const { orderStatus } = req.body;
    order.CartItem.set({
        orderStatus: orderStatus
    });

    await order.save();

    return res.json(order)
})

module.exports = router;
