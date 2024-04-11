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
            }
        ]
    });

    console.log(listings);

    let listingsList = [];

    listings.forEach(listing => {
        listingsList.push(listing.toJSON());
    });

    return res.json({ Listings: listingsList });

})

module.exports = router;
