"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODEMAILER_PASS = exports.NODEMAILER_USER = exports.CLOUDINARY_PAYMENT_PROOF_IMAGE_FOLDER = exports.CLOUDINARY_EVENT_BANNER_FOLDER = exports.CLOUDINARY_USER_PROFILE_IMAGE_FOLDER = exports.JWT_REFRESH_SECRET = exports.JWT_ACCESS_SECRET = exports.corsOptions = exports.PORT = exports.NODE_ENV = void 0;
const dotenv_1 = require("dotenv");
const path_1 = require("path");
exports.NODE_ENV = process.env.NODE_ENV || 'development';
const envFile = exports.NODE_ENV === 'development' ? '.env.local' : '.env';
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, `../${envFile}`), override: true });
exports.PORT = process.env.PORT || 8000;
exports.corsOptions = {
    origin: ['https://mini-loket.vercel.app', 'http://localhost:3000'],
    credentials: true
};
exports.JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || '';
exports.JWT_REFRESH_SECRET = process.env.ACCESS_TOKEN_SECRET || '';
exports.CLOUDINARY_USER_PROFILE_IMAGE_FOLDER = 'loket-user-profile-images';
exports.CLOUDINARY_EVENT_BANNER_FOLDER = 'loket-event-banners';
exports.CLOUDINARY_PAYMENT_PROOF_IMAGE_FOLDER = 'loket-payment-proof-images';
exports.NODEMAILER_USER = process.env.NODEMAILER_USER;
exports.NODEMAILER_PASS = process.env.NODEMAILER_PASS;
