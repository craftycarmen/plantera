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
                            attributes: ['id', 'sellerId', 'plantName', 'price', 'potSize'],
                            where: {
                                sellerId: user.id
                            },
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
    const { user } = req;

    if (!user) return res.status(403).json({ message: "Forbidden" })

    try {
        const order = await Order.findOne({
            where: {
                id: orderId
            },
            attributes: {
                exclude: ['cartId']
            },
            include:
            {
                model: CartItem,
                attributes: ['id', 'cartQty', 'orderStatus', 'listingId'],
            }
        })

        if (!order) return res.status(404).json({ message: "Order couldn't be found" });

        const cartItems = await CartItem.findAll({
            where: {
                orderId: orderId
            },
            include:
            {
                model: Listing,
                attributes: ['id', 'sellerId', 'plantName', 'price', 'potSize'],
            }
        })

        if (!cartItems.length) return res.status(404).json({ message: "No items found for this order" });

        const { itemId, orderStatus } = req.body;
        const item = cartItems.find(cartItem => cartItem.id === itemId)

        if (!item) return res.status(404).json({ message: "Order item couldn't be found" });

        if (item.Listing.sellerId !== user.id) return res.status(403).json({ message: "Forbidden" })

        item.orderStatus = orderStatus;
        await item.save()

        console.log('Item ID:', itemId, 'Order Status:', orderStatus);
        console.log("Order item updated:", item);

        return res.json(order);
    } catch (error) {
        console.error("Error updating order:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
