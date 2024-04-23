const express = require('express');
const { User, ShoppingCart, CartItem, Listing, Image, Order } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    // const { user } = req;
    const cartId = Number(req.query.cartId);

    // const cartId = localStorage.getItem("cartId");

    // if (!user) {
    //     return res.status(404).json({ message: "User not found" });
    // }

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
            id: cartId
        }
    })

    return res.json({ ShoppingCart: shoppingCart })

});

router.get('/:cartId', async (req, res) => {
    const cartId = Number(req.params.cartId);

    const { user } = req;

    let buyerId = null;
    if (user) {
        buyerId = user.id;
    }

    const shoppingCart = await ShoppingCart.findOne({
        include: [
            {
                model: CartItem,
                include: {
                    model: Listing,
                    attributes: ['id', 'plantName', 'price', 'stockQty', 'potSize'],
                    include: {
                        model: Image,
                        as: 'ListingImages',
                        attributes: ['id', 'url']
                    }
                }
            },
        ],
        where: {
            id: cartId
        }
    });

    // if (buyerId !== null && shoppingCart.buyerId !== user.id) return res.status(403).json({ message: "Forbidden" })

    if (!shoppingCart) {
        return res.status(404).json({ error: 'Shopping cart not found' });
    }

    const cartItems = shoppingCart.CartItems
    const cartItemsList = []

    cartItems.forEach(item => {
        cartItemsList.push(item.toJSON())
    });

    let cartTotal = 0;
    let numCartItems = 0;
    cartItemsList.forEach(item => {
        cartTotal += item.cartQty * item.Listing.price
        numCartItems += item.cartQty
    })

    cartItemsList.forEach(item => {
        item.cartItemsTotal = item.cartQty * item.Listing.price
    })

    let getCartById = {
        id: shoppingCart.id,
        buyerId: buyerId,
        createdAt: shoppingCart.createdAt,
        updatedAt: shoppingCart.updatedAt,
        cartTotal: cartTotal,
        numCartItems: numCartItems,
        CartItems: cartItemsList
    }

    return res.json({ ShoppingCart: getCartById })

});

router.post('/', async (req, res) => {

    try {
        const { user } = req;

        let buyerId = null;
        if (user) {
            buyerId = user.id;
        }
        const { cartId } = req.body;

        const existingCart = await ShoppingCart.findByPk(cartId);

        if (!existingCart) {
            const newCart = await ShoppingCart.create({ buyerId, cartId })
            return res.status(201).json(newCart);
        } else {
            return res.status(200).json(existingCart);
        }
    }
    catch (err) {
        return res.json(err.message)
    }
});

router.put('/:cartId', requireAuth, async (req, res) => {
    try {
        const cartId = Number(req.params.cartId);
        const cart = await ShoppingCart.findByPk(cartId)
        const { user } = req

        if (!cart) return res.status(404).json({ message: "Cart couldn't be found" })

        await cart.update({
            buyerId: user.id
        })

        return res.json(cart)
    } catch (err) {
        return res.status(500).json(err.message)
    }
});

router.delete('/:cartId', requireAuth, async (req, res) => {
    const cartId = Number(req.params.cartId);

    const cart = await ShoppingCart.findByPk(cartId)

    if (!cart) return res.status(404).json({ message: "Cart couldn't be found" })

    await CartItem.update({
        cartId: null
    }, {
        where:
        {
            cartId
        }
    })

    await Order.update({
        cartId: null
    }, {
        where:
        {
            cartId
        }
    })

    await cart.destroy();


    return res.json({ message: "Successfully deleted" })

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
});

router.put('/:cartId/item/:itemId', async (req, res) => {
    try {
        const cartId = Number(req.params.cartId);
        const itemId = Number(req.params.itemId);

        const cart = await ShoppingCart.findOne({
            where: {
                id: cartId
            }
        })

        const cartItem = await CartItem.findOne({
            where: {
                id: itemId
            }
        })

        const { cartQty } = req.body

        if (cartItem) {
            cartItem.cartQty = cartQty;

            await cartItem.save();
        }

        await cart.reload();

        return res.json(cartItem)
    } catch (err) {
        return res.status(500).json(err.message)
    }
})

router.delete('/:cartId/item/:itemId', async (req, res) => {
    const cartId = Number(req.params.cartId);
    const itemId = Number(req.params.itemId);

    const item = await CartItem.findByPk(itemId)

    if (!cartId) return res.status(404).json({ message: "Cart couldn't be found" })

    if (!itemId) return res.status(404).json({ message: "Cart item couldn't be found" })

    await item.destroy();

    return res.json({ message: "Successfully deleted" })

});



module.exports = router;
