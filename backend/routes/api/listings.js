const express = require('express')
const { Listing, Image, User, Guide, ListingGuide, CartItem } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { singleFileUpload, singleMulterUpload } = require("../../awsS3");

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
        const { plantName, description, price, potSize, stockQty } = req.body;
        const selectedGuides = req.body.selectedGuides ? JSON.parse(req.body.selectedGuides) : [];
        const listingImageUrl = req.file ?
            await singleFileUpload({ file: req.file, public: true }) :
            null;

        const listing = await Listing.create({
            sellerId: req.user.id,
            plantName,
            description,
            price,
            potSize,
            stockQty,
            selectedGuides,
            // listingImageUrl
        });

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

    const { plantName, description, price, potSize, stockQty, selectedGuides } = req.body;

    listing.set({
        sellerId: req.user.id,
        plantName: plantName,
        description: description,
        price: Number.parseFloat(price),
        potSize: potSize,
        stockQty: stockQty,
        selectedGuides: selectedGuides,
    });

    await listing.save();

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
        await listing.destroy();
        return res.json({ message: "Successfully deleted" })
    }
});

module.exports = router;
