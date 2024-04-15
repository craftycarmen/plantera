const express = require('express');
const { ShoppingCart, CartItem, Listing, Image } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {
        const shoppingCart = await ShoppingCart.findOne({
            include: {
                model: CartItem,
                include: {
                    model: Listing,
                    attributes: ['id', 'plantName', 'price', 'stockQty'],
                    include: {
                        model: Image,
                        as: 'ListingImages',
                        attributes: ['id', 'url']
                    }
                },
            },
            where: {
                buyerId: user.id
            }
        })

        return res.json({ ShoppingCart: shoppingCart })
    }
})

module.exports = router;
