const express = require("express");
const { Image } = require("../../db/models");
const { multipleFilesUpload, multipleMulterUpload, retrievePrivateFile } = require("../../awsS3");

const router = express.Router();

// router.get(
//     '/:imageId',
//     async (req, res) => {
//         const images = await Image.findAll({ where: { userId: req.params["userId"] } });
//         const imageUrls = images.map(image => retrievePrivateFile(image.key));
//         return res.json(imageUrls);
//     }
// );

router.post('/:imageId', multipleMulterUpload("images"), async (req, res) => {
    const { imageId, imageableType } = req.params;
    const keys = await multipleFilesUpload({ files: req.files });
    const images = await Promise.all(
        keys.map(key => Image.create({ key, imageId, imageableType }))
    );
    const imageUrls = images.map(image => retrievePrivateFile(image.key));
    return res.json(imageUrls);
}
);

module.exports = router;
