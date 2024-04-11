const express = require('express')
const { Listing, Image, User, Guide, ListingGuide } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

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
        console.log(listing.Guides);
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
            console.log(listing.Guides);
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
                attributes: ['id', 'username', 'shopDescription', 'createdAt'],
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

module.exports = router;
