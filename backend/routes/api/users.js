const express = require('express')
const bcrypt = require('bcryptjs');
const { singleFileUpload, singleMulterUpload } = require("../../awsS3");

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// Sign up
router.post(
    '/',
    singleMulterUpload("image"),
    validateSignup,
    async (req, res) => {
        const { email, firstName, lastName, password, username,
            bio,
            favoritePlant,
            accountType,
            shopDescription,
            paymentMethod,
            paymentDetails } = req.body;
        const profileImageUrl = req.file ?
            await singleFileUpload({ file: req.file, public: true }) :
            null;

        console.log("PROFILEIMG", profileImageUrl);

        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({
            email, username, firstName, lastName, hashedPassword,
            bio,
            favoritePlant,
            accountType,
            shopDescription,
            paymentMethod,
            paymentDetails,
            // profileImageUrl
        });


        await Image.create({
            imageableId: user.id,
            imageableType: 'User',
            url: profileImageUrl
        });



        console.log("USER", user);

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

        return res.json({
            user: safeUser
        });
    }
);

// router.post('/', singleMulterUpload("image"), validateSignup, async (req, res) => {
//     const { email, firstName, lastName, password, username, bio, favoritePlant, accountType, shopDescription, paymentMethod, paymentDetails } = req.body;
//     const profileImageUrl = req.file ? req.file.location : null; // Assuming req.file.location contains the URL of the uploaded image

//     try {
//         const user = await User.create({
//             email, username, firstName, lastName, hashedPassword: bcrypt.hashSync(password),
//             bio, favoritePlant, accountType, shopDescription, paymentMethod, paymentDetails, profileImageUrl
//         });

//         // If image was uploaded, associate it with the user
//         if (req.file) {
//             await Image.create({
//                 imageableId: user.id,
//                 imageableType: 'User',
//                 url: profileImageUrl
//             });
//         }

//         // Respond with the created user
//         return res.status(201).json({ user });
//     } catch (error) {
//         // Handle error
//         console.error(error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// });


// router.post('/', singleMulterUpload("image"), validateSignup, async (req, res) => {
//     const { email, firstName, lastName, password, username, bio, favoritePlant, accountType, shopDescription, paymentMethod, paymentDetails } = req.body;
//     const profileImageUrl = req.file ? req.file.location : null;

//     console.log('req.file:', req.file);
//     console.log('profileImageUrl:', profileImageUrl);

//     try {
//         let user, image;

//         // Create the user without the profile image URL first
//         user = await User.create({
//             email, username, firstName, lastName, hashedPassword: bcrypt.hashSync(password),
//             bio, favoritePlant, accountType, shopDescription, paymentMethod, paymentDetails, profileImageUrl: null // Set to null for now
//         });

//         // If image was uploaded, associate it with the user
//         if (req.file) {
//             // Check if profile image URL is available
//             if (!profileImageUrl) {
//                 return res.status(400).json({ error: 'Profile image URL is required' });
//             }

//             // Create the Image instance with the profile image URL
//             image = await Image.create({
//                 imageableId: user.id,
//                 imageableType: 'User',
//                 url: profileImageUrl
//             });
//         }

//         // Update the user's profile image URL if it's available
//         if (image) {
//             await user.update({ profileImageUrl: profileImageUrl });
//         }

//         // Respond with the created user
//         return res.status(201).json({ user });
//     } catch (error) {
//         // Handle validation error
//         if (error.name === 'SequelizeValidationError') {
//             const errors = error.errors.map(err => err.message);
//             return res.status(400).json({ errors });
//         }

//         // Handle other errors
//         console.error(error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// });



module.exports = router;
