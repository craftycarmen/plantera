const express = require('express')
const bcrypt = require('bcryptjs');
const { singleFileUpload, singleMulterUpload } = require("../../awsS3");
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Image, ShoppingCart, Listing, Guide, CartItem } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email')
        .bail()
        .custom(async (value, { req }) => {
            const user = await User.unscoped().findOne({
                where: {
                    email: value
                }
            });

            if (user) {
                throw new Error('Email already exists')
            }
        }),
    check('username')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Username is required')
        .bail()
        .isLength({ min: 4 })
        .withMessage('Username must be 4 characters or more')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email')
        .bail()
        .custom(async (value, { req }) => {
            const user = await User.findOne({
                where: {
                    username: value
                }
            })

            if (user) {
                throw new Error('Username already exists')
            }
        }),
    check('firstName')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Last Name is required'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more'),
    handleValidationErrors
];

// Sign up
router.post(
    '/',
    singleMulterUpload("image"),
    validateSignup,
    async (req, res) => {
        const { email, firstName, lastName, password, username,
            // bio,
            // favoritePlant,
            // accountType,
            // shopDescription,
            // paymentMethod,
            // paymentDetails
        } = req.body;
        const profileImageUrl = req.file ?
            await singleFileUpload({ file: req.file, public: true }) :
            null;

        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({
            email, username, firstName, lastName, hashedPassword,
            // bio,
            // favoritePlant,
            // accountType,
            // shopDescription,
            // paymentMethod,
            // paymentDetails,
            // profileImageUrl
        });


        if (profileImageUrl) {
            await Image.create({
                imageableId: user.id,
                imageableType: 'User',
                url: profileImageUrl
            })
        }

        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            // bio: user.bio,
            // favoritePlant: user.favoritePlant,
            // accountType: user.accountType,
            // shopDescription: user.shopDescription,
            // paymentMethod: user.paymentMethod,
            // paymentDetails: user.paymentDetails
        };

        await setTokenCookie(res, safeUser);

        const { cartId } = req.body

        if (cartId) {
            const cart = await ShoppingCart.findByPk(cartId);

            if (cart) {
                cart.buyerId = user ? user.id : null;
                await cart.save();
            }
        }

        const cartByUser = await ShoppingCart.findOne({
            where:
            {
                buyerId: user.id
            }
        })

        return res.json({
            user: safeUser,
            userId: safeUser.id,
            cart: cartByUser,
            cartId: cartByUser ? cartByUser.id : null
        });
    }
);

router.get('/:userId', async (req, res) => {
    const userId = Number(req.params.userId)
    const user = await User.findOne({
        include: {
            model: Image,
            as: 'UserImages',
            attributes: ['id', 'url', 'avatar']
        },
        where: {
            id: userId
        }
    })

    if (!user) return res.status(404).json({ message: 'User not found' });

    let shop = await Listing.findAll({
        include: {
            model: Image,
            as: "ListingImages",
        },
        where: {
            sellerId: userId
        }
    });

    let guides = await Guide.findAll({
        include: {
            model: Image,
            as: "GuideImages"
        },
        where: {
            userId: userId
        }
    })

    if (shop.length === 0) shop === null;
    if (guides.length === 0) guides === null;

    return res.json({ User: user, Shop: shop, Guides: guides })
})

router.put('/:userId', singleMulterUpload("image"), requireAuth, async (req, res) => {
    const userId = Number(req.params.userId)
    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({ message: "User couldn't be found" });

    if (req.user.id !== userId) return res.status(403).json({ message: "Forbidden" });

    const {
        bio,
        favoritePlant,
        accountType,
        shopDescription,
        city,
        state,
        paymentMethod,
        paymentDetails } = req.body;

    const profileImageUrl = req.file ?
        await singleFileUpload({ file: req.file, public: true }) :
        null;


    user.set({
        bio: bio,
        favoritePlant: favoritePlant,
        accountType: accountType,
        shopDescription: shopDescription,
        city: city,
        state: state,
        paymentMethod: paymentMethod,
        paymentDetails: paymentDetails,
    });

    if (profileImageUrl) {


        await Image.create({
            imageableId: userId,
            imageableType: 'User',
            url: profileImageUrl
        })

    }

    await user.save();

    return res.json(user);
});



module.exports = router;
