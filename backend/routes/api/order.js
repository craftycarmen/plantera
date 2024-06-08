const express = require('express');
const { CartItem, Order, Listing, Image, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/orders', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {
        let orders = await Order.findAll({
            where: {
                buyerId: user.id
            },
            include: {
                model: CartItem,
                attributes: ['cartQty', 'orderStatus'],
                include: {
                    model: Listing,
                    attributes: ['plantName', 'price', 'potSize'],
                    include: [
                        {
                            model: User,
                            as: 'Seller',
                            attributes: ['id', 'username']
                        },
                        {
                            model: Image,
                            as: 'ListingImages',
                            attributes: ['url']
                        }
                    ]
                }
            }
        });

        return res.json({ Orders: orders })
    }
});

router.get('/:orderId', requireAuth, async (req, res) => {
    const orderId = Number(req.params.orderId);
    const order = await Order.findOne({
        where: {
            id: orderId
        },
        // attributes: ['buyerId']
    });

    const { user } = req;
    if (order.buyerId !== user.id) return res.status(403).json({ message: "Forbidden" })
    const orderItems = await CartItem.findAll({
        include: {
            model: Listing,
            attributes: ['plantName', 'price', 'potSize'],
            include: {
                model: Image,
                as: 'ListingImages',
                attributes: ['url']
            }
        },
        where: {
            orderId: orderId
        }
    })

    if (!order) return res.json(404).json({ error: 'Order ID not found' })

    return res.json({ Order: order, OrderItems: orderItems })

})

module.exports = router;
