const express = require('express');
const { ShoppingCart, CartItem, Listing, Image } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/:cartId', async (req, res) => {
    const { user } = req;

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

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
});

router.post('/', async (req, res) => {

    try {
        const { cartId } = req.body;

        const existingCart = await ShoppingCart.findByPk(cartId);

        if (!existingCart) {
            const newCart = await ShoppingCart.create({
                buyerId: req.user.id,
            })
            return res.status(201).json(newCart);
        } else {
            return res.status(200).json(existingCart);
        }
    }
    catch (err) {
        return res.json(err.message)
    }
});

router.post('/:cartId/items', async (req, res) => {

    try {
        const cartId = Number(req.params.cartId);
        const { listingId, cartQty } = req.body;

        const existingCart = await ShoppingCart.findByPk(cartId);

        if (!existingCart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const cartItem = await CartItem.create({
            cartId: cartId,
            listingId: Number(listingId),
            cartQty: cartQty
        })

        return res.status(201).json(cartItem)
    } catch (err) {
        return res.status(500).json(err.message)
    }
})

module.exports = router;
