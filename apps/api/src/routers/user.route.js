"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_1 = require("../helpers/multer");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const router = express_1.default.Router();
router.post('/password-verification', auth_middleware_1.verifyToken, user_controller_1.default.verifyPassword);
router.patch('/', auth_middleware_1.verifyToken, multer_1.uploadProfileImage.single('image'), user_controller_1.default.update);
router.get('/coupons', auth_middleware_1.verifyToken, user_controller_1.default.getCoupons);
router.get('/tickets', auth_middleware_1.verifyToken, user_controller_1.default.getTickets);
router.get('/e-vouchers/:eVoucherId', auth_middleware_1.verifyToken, user_controller_1.default.getEVoucher);
router.patch('/coupons', auth_middleware_1.verifyToken, user_controller_1.default.updateCoupons);
exports.default = router;
