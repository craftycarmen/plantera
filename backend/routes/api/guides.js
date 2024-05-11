const express = require('express');
const { Guide, Image, ListingGuide, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { singleFileUpload, singleMulterUpload } = require('../../awsS3');

const router = express.Router();

router.get('/', async (req, res) => {
    const guides = await Guide.findAll({
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
    });

    let guidesList = [];

    guides.forEach(guide => {
        guidesList.push(guide.toJSON());
    });

    return res.json({ Guides: guidesList })
})

module.exports = router;
