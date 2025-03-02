"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPaymentProofImage = exports.uploadEventBanner = exports.uploadProfileImage = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const MAX_PROFILE_IMAGE_SIZE = 1024000; // 1mb
const MAX_EVENT_BANNER_SIZE = 2048000; // 2mb
const MAX_PAYMENT_PROOF_IMAGE_SIZE = 1024000; // 1mb
exports.uploadProfileImage = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg') {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    },
    limits: {
        fileSize: MAX_PROFILE_IMAGE_SIZE
    }
});
exports.uploadEventBanner = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg') {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    },
    limits: {
        fileSize: MAX_EVENT_BANNER_SIZE
    }
});
exports.uploadPaymentProofImage = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg') {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    },
    limits: {
        fileSize: MAX_PAYMENT_PROOF_IMAGE_SIZE
    }
});
