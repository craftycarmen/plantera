const express = require('express')
const { Listing, Image, User, Guide } = require('../../db/models');

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
        if (listing.Guides.length === 0) {
            listing.Guides = null
        }
    });

    return res.json({ Listings: listingsList });

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
                attributes: ['id', 'username', 'shopDescription'],
                include: {
                    model: Image,
                    as: 'UserImages'
                }
            },
            {
                model: Guide,
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
})

module.exports = router;
