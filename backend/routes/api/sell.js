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
                    attributes: ['id', 'cartQty', 'orderStatus'],
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
    console.log("orderId!!!!!!!", orderId);
    const order = await Order.findOne({
        attributes: {
            exclude: ['cartId']
        },
        include: [
            {
                model: CartItem,
                attributes: ['id', 'cartQty', 'orderStatus'],
                where: {
                    orderId: orderId
                },
                include: [
                    {
                        model: Listing,
                        attributes: ['id', 'plantName', 'price', 'potSize'],
                    }
                ]
            }
        ]

    });

    if (!order) return res.status(404).json({ message: "Order couldn't be found" });

    const { itemId, orderStatus } = req.body;
    console.log('Item ID:', itemId, 'Order Status:', orderStatus);

    const item = await CartItem.findOne({
        where: {
            id: itemId,
            orderId: orderId
        }
    })

    if (!item) return res.status(404).json({ message: "Order item couldn't be found" });

    item.set({
        id: item.Id,
        orderStatus: orderStatus
    });

    await item.save();

    return res.json(order)
})

module.exports = router;
