"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicId = void 0;
const cloudinary_1 = require("cloudinary");
const getPublicId = (imagePath) => {
    return imagePath
        .split('/image/upload/')[1]
        .split('.')[0]
        .split('/')
        .slice(1)
        .join('/');
};
exports.getPublicId = getPublicId;
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
exports.default = cloudinary_1.v2;
