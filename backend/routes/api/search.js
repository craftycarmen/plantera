const express = require('express')
const { Listing, Image, User, Guide, Review } = require('../../db/models');
const { Op } = require('sequelize');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');


const router = express.Router();

const validateQuery = [
    check('page')
        .isInt({ min: 1 })
        .withMessage('Page must be greater than or equal to 1')
        .optional(),
    check('size')
        .isInt({ min: 1 })
        .withMessage('Size must be greater than or equal to 1')
        .optional(),
    check('minPotSize')
        .isFloat({ min: 2, max: 12 })
        .withMessage('Minimum pot size must be greater than or equal to 2 inches')
        .bail()
        .custom(async (min, { req }) => {
            const max = req.query.maxPotSize;
            if (Number.parseFloat(min) > Number.parseFloat(max)) {
                throw new Error('Minimum pot size cannot be greater than maximum pot size')
            }
        })
        .optional(),
    check('maxPotSize')
        .isFloat({ min: 2, max: 12 })
        .withMessage('Maximum pot size must be greater than or equal to 12 inches')
        .bail()
        .custom(async (max, { req }) => {
            const min = req.query.minPotSize;
            if (Number.parseFloat(max) < Number.parseFloat(min)) {
                throw new Error('Maximum pot size cannot be less than minimum pot size')
            }
        })
        .optional(),
    check('minPrice')
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be greater than or equal to 0')
        .bail()
        .custom(async (min, { req }) => {
            const max = req.query.maxPrice;
            if (Number.parseFloat(min) > Number.parseFloat(max)) {
                throw new Error('Minimum price cannot be greater than maximum price')
            }
        })
        .optional(),
    check('maxPrice')
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be greater than or equal to 0')
        .bail()
        .custom(async (max, { req }) => {
            const min = req.query.minPrice;
            if (Number.parseFloat(max) < Number.parseFloat(min)) {
                throw new Error('Maximum price cannot be less than minimum price')
            }
        })
        .optional(),
    handleValidationErrors
]

router.get('/', validateQuery, async (req, res) => {
    let { page, size, minPrice, maxPrice, search, potSize } = req.query
    // 
    potSize = potSize?.split(",").map(Number)
    // 
    const results = {}
    const pagination = {}
    const where = {}

    if (page || size) {
        if (page >= 1 && size >= 1) {
            pagination.limit = size;
            pagination.offset = size * (page - 1)
        }

        if (size > 20) size = 20
        if (page > 10) page = 10
    }

    if (potSize) {
        if (potSize.includes(0)) {
            where.potSize = {
                [Op.in]: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            };
        } else if (potSize.length > 1) {
            where.potSize = {
                [Op.in]: potSize
            };
        } else {
            where.potSize = potSize[0];
        }
    }

    if (minPrice && maxPrice) {
        where.price = {
            [Op.between]: [minPrice, maxPrice]
        }
    }

    if (minPrice && !maxPrice) {
        where.price = {
            [Op.gte]: [minPrice]
        }
    }

    if (!minPrice && maxPrice) {
        where.price = {
            [Op.lte]: [maxPrice]
        }
    }

    if (process.env.NODE_ENV === 'development') {
        if (search) {
            where.plantName = {
                [Op.or]: [
                    {
                        [Op.like]: `%${search}%`
                    },
                    {
                        [Op.like]: `${search}%`
                    },
                    {
                        [Op.like]: `%${search}`
                    },
                ]
            }
        }
    } else {
        if (search) {
            where.plantName = {
                [Op.or]: [
                    {
                        [Op.iLike]: `%${search}%`
                    },
                    {
                        [Op.iLike]: `${search}%`
                    },
                    {
                        [Op.iLike]: `%${search}`
                    },
                ]
            }
        }
    }

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
                model: Review,
                as: 'Reviews',
            },
            {
                model: Guide
            }
        ],
        where,
        ...pagination
    });

    let listingsList = [];

    listings.forEach(listing => {
        if (listing.stockQty > 0) listingsList.push(listing.toJSON());
    });

    const sellerIds = [...new Set(listingsList.map(listing => listing.Seller.id))];

    // console.log("SELLERIDDD", sellerIds);
    const allReviews = await Review.findAll({
        include: [
            {
                model: Listing,
                where: {
                    sellerId: sellerIds
                },
                attributes: ['sellerId']
            }
        ]
    })

    const sellerRatings = {};

    allReviews.forEach(review => {
        const sellerId = review.Listing.sellerId;
        if (!sellerRatings[sellerId]) {
            sellerRatings[sellerId] = { totalStars: 0, count: 0 }
        }

        sellerRatings[sellerId].totalStars += review.stars;
        sellerRatings[sellerId].count++;
    })

    Object.keys(sellerRatings).forEach(sellerId => {
        sellerRatings[sellerId].avgRating = sellerRatings[sellerId].totalStars / sellerRatings[sellerId].count
    })

    listingsList.forEach(listing => {
        if (listing.Guides.length === 0) {
            listing.Guides = null
        }

        const sellerId = listing.Seller.id;
        listing.Seller.sellerRating = sellerRatings[sellerId] ? sellerRatings[sellerId].avgRating : null;
    });

    results.Listings = listingsList
    if (page) results.page = page;
    if (size) results.size = size;
    if (listingsList.length === 0) {
        return res.status(404).json({ message: 'No listings found' })

    } else {
        return res.json(results);
    }
})

module.exports = router;
