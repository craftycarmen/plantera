const express = require('express');
const { Guide, Image, ListingGuide, User, Listing } = require('../../db/models');
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
});

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;

    if (user) {
        const guides = await Guide.findAll({
            include: [
                {
                    model: Image,
                    as: 'GuideImages',
                    attributes: {
                        exclude: ['avatar']
                    }
                },
            ],
            where: {
                userId: user.id
            }
        });

        let guidesList = [];

        guides.forEach(guide => {
            guidesList.push(guide.toJSON())
        });

        if (guidesList.length === 0) {
            return res.json({ Guides: "No guides found" })
        } else {
            return res.json({ Guides: guidesList })
        }
    }
})

router.get('/:guideId', async (req, res) => {
    const guide = await Guide.findByPk(req.params.guideId, {
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
    })

    if (guide) {
        return res.json(guide)
    } else {
        return res.status(404).json({
            message: "Guide couldn't be found"
        })
    }
});

router.post('/', singleMulterUpload("image"), requireAuth, async (req, res) => {
    try {
        const { title, description, image, content } = req.body;

        const guideImageUrl = req.file ?
            await singleFileUpload({ file: req.file, public: true }) :
            null;

        const guide = await Guide.create({
            userId: req.user.id,
            title,
            description,
            content
        });

        await Image.create({
            imageableId: guide.id,
            imageableType: 'Guide',
            url: guideImageUrl
        })

        return res.status(201).json(guide)
    } catch (err) {
        return res.json(err.message);
    }
});

router.put('/:guideId', requireAuth, async (req, res) => {
    const guideId = Number(req.params.guideId);
    const guide = await Guide.findByPk(guideId);

    if (!guide) return res.status(404).json({ message: "Guide couldn't be found" });

    if (req.user.id !== guide.userId) return res.status(403).json({ message: "Forbidden" });

    const { title, description, content } = req.body;

    guide.set({
        userId: req.user.id,
        title,
        description,
        content
    });

    await guide.save();

    return res.json(guide)

});

router.delete('/:guideId', requireAuth, async (req, res) => {
    const guideId = Number(req.params.guideId);
    const guide = await Guide.findByPk(guideId);

    if (!guide) return res.status(404).json({ message: "Guide couldn't be found" });

    if (req.user.id !== guide.userId) return res.status(403).json({ message: "Forbidden" });

    await Listing.update({ guideId: null }, {
        where: {
            guideId: guideId
        }
    })

    await ListingGuide.destroy({
        where: {
            guideId: guideId
        }
    })
    await guide.destroy();

    return res.json({ message: "Successfully deleted" })
})

module.exports = router;
