const express = require('express')
const { Listing, Image, User, Guide, ListingGuide, CartItem, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation')
const { singleFileUpload, singleMulterUpload } = require("../../awsS3");

const router = express.Router();

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

router.get('/', async (req, res) => {

    const listings = await Listing.findAll({
        include: [
            {
                model: Image,
                as: 'ListingImages',
                attributes: {
                    exclude: ['avatar']
                }
            },
            {
                model: User,
                as: 'Seller',
                attributes: ['id', 'username', 'shopDescription']
            },
            {
                model: Guide
            }
        ]
    });

    let listingsList = [];

    listings.forEach(listing => {
        listingsList.push(listing.toJSON());
    });

    listingsList.forEach(listing => {
        if (listing.Guides.length === 0) {
            listing.Guides = null
        }
    });

    return res.json({ Listings: listingsList });

});

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {
        const listings = await Listing.findAll({
            include: [
                {
                    model: Image,
                    as: 'ListingImages',
                    attributes: {
                        exclude: ['avatar']
                    }
                },
                {
                    model: Guide,
                    through: {
                        model: ListingGuide,
                    },
                    attributes: ['id', 'title', 'userId'],
                    include: [
                        {
                            model: Image,
                            as: 'GuideImages',
                            attributes: {
                                exclude: ['avatar']
                            }
                        }
                    ]
                }
            ],
            where: {
                sellerId: user.id
            }
        })


        let listingsList = [];

        listings.forEach(listing => {
            listingsList.push(listing.toJSON());
        });

        listingsList.forEach(listing => {
            if (listing.Guides.length === 0) {
                listing.Guides = null
            }
        });

        if (listingsList.length === 0) {
            return res.json({ Listings: "No listings found" })
        } else {
            return res.json({ Listings: listingsList });
        }
    }
});

router.get('/:listingId', async (req, res) => {
    const listing = await Listing.findByPk(req.params.listingId, {
        include: [
            {
                model: Image,
                as: 'ListingImages',
                attributes: {
                    exclude: ['avatar']
                }
            },
            {
                model: User,
                as: 'Seller',
                attributes: ['id', 'username', 'city', 'state', 'shopDescription', 'createdAt'],
                include: {
                    model: Image,
                    as: 'UserImages'
                }
            },
            {
                model: Guide,
                through: {
                    model: ListingGuide,
                },
                attributes: ['id', 'title', 'userId'],
                include: [
                    {
                        model: Image,
                        as: 'GuideImages',
                        attributes: {
                            exclude: ['avatar']
                        }
                    },
                    {
                        model: User,
                        as: 'Author',
                        attributes: ['id', 'username']
                    }
                ]
            }
        ]
    })

    if (listing) {
        return res.json(listing)
    } else {
        return res.status(404).json({
            message: "Listing couldn't be found"
        });
    }
});

router.post('/', singleMulterUpload("image"), requireAuth, async (req, res) => {

    try {
        const { plantName, description, price, potSize, stockQty, guideIds } = req.body;
        const guideIdsArray = guideIds.split(',').map(id => parseInt(id.trim()));
        if (guideIdsArray.length === 1 && !isNaN(guideIdsArray[0])) {
            guideIdsArray.push(guideIdsArray[0])
        }


        const listingImageUrl = req.file ?
            await singleFileUpload({ file: req.file, public: true }) :
            null;

        const listing = await Listing.create({
            sellerId: req.user.id,
            plantName,
            description,
            price,
            potSize,
            stockQty
            // listingImageUrl
        });

        if (guideIds && guideIds.length > 0) {
            await Promise.all(guideIdsArray.map(async (guideId) => {
                await ListingGuide.create({
                    listingId: listing.id,
                    guideId: guideId
                })
            }))
        }

        await Image.create({
            imageableId: listing.id,
            imageableType: 'Listing',
            url: listingImageUrl
        });

        return res.status(201).json(listing)

    } catch (err) {
        return res.json(err.message);
    }
});

router.put('/:listingId', requireAuth, async (req, res) => {
    const listingId = Number(req.params.listingId);
    const listing = await Listing.findByPk(listingId);


    if (!listing) return res.status(404).json({ message: "Listing couldn't be found" });

    if (req.user.id !== listing.sellerId) return res.status(403).json({ message: "Forbidden" });

    const { plantName, description, price, potSize, stockQty, guideIds } = req.body;
    const guideIdsArray = guideIds.split(',').map(id => parseInt(id.trim()));
    if (guideIdsArray.length === 1 && !isNaN(guideIdsArray[0])) {
        guideIdsArray.push(guideIdsArray[0])
    }
    listing.set({
        sellerId: req.user.id,
        plantName: plantName,
        description: description,
        price: Number.parseFloat(price),
        potSize: potSize,
        stockQty: stockQty,
    });

    await listing.save();

    await ListingGuide.destroy({ where: { listingId: listing.id } });

    if (guideIdsArray.length > 0) {
        await Promise.all(guideIdsArray.map(async (guideId) => {
            await ListingGuide.create({
                listingId: listing.id,
                guideId
            })
        }))
    }

    return res.json(listing)
});


router.delete('/:listingId', requireAuth, async (req, res) => {
    const listingId = Number(req.params.listingId);
    const listing = await Listing.findByPk(listingId)
    const items = await CartItem.findAll({
        where: {
            listingId: listingId,
        }
    })

    const orderedItems = items.filter(item => item.orderId !== null)

    if (!listing) return res.status(404).json({ message: "Listing couldn't be found" });

    if (req.user.id !== listing.sellerId) return res.status(403).json({ message: "Forbidden" });

    if (orderedItems.length > 0) {
        return res.status(403).json({ message: "Forbidden — listing is attached to an order" })
    } else {
        await ListingGuide.destroy({
            where: {
                listingId: listingId
            }
        })
        await listing.destroy();

        return res.json({ message: "Successfully deleted" })
    }
});

router.get('/:listingId/reviews', async (req, res) => {
    const listingId = Number(req.params.listingId);
    const listing = await Listing.findByPk(listingId);

    if (!listing) return res.status(404).json({ message: "Listing couldn't be found" });

    let reviews = await Review.findAll({
        where: {
            listingId: listingId
        },
        include: [
            {
                model: Listing,
                attributes: ['id', 'plantName'],
                include: {
                    model: User,
                    as: 'Seller',
                    attributes: ['id', 'username']
                }
            },
            {
                model: User,
                as: 'Reviewer',
                attributes: ['id', 'username']
            }
        ]
    })

    let reviewsList = [];

    reviews.forEach(review => {
        reviewsList.push(reviews = review.toJSON());
    });

    if (reviews) return res.json({ Reviews: reviewsList })
});

router.post('/:listingId/reviews', requireAuth, validateReview, async (req, res) => {

    try {
        const listingId = Number(req.params.listingId);

        const userId = req.user.id;
        const listing = await Listing.findByPk(listingId);

        if (!listing) return res.status(404).json({ message: "Listing couldn't be found" });

        const userReview = await Review.findAll({
            where: {
                buyerId: userId,
                listingId: listingId
            }
        })

        if (userReview.length === 0) {
            const { review, stars } = req.body;

            const newReview = await Review.create({
                buyerId: userId,
                listingId: listingId,
                review: review,
                stars: stars
            })

            return res.status(201).json(newReview)
        } else {
            return res.status(500).json({ message: 'Review already exists for this purchased item' })
        }
    } catch (err) {
        return res.json(err.message)
    }
})

module.exports = router;
