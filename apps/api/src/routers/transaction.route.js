"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_1 = require("../helpers/multer");
const transaction_controller_1 = __importDefault(require("../controllers/transaction.controller"));
const router = express_1.default.Router();
router.post('/', multer_1.uploadPaymentProofImage.single('paymentProofImage'), transaction_controller_1.default.createTransaction);
router.get('/', auth_middleware_1.verifyToken, transaction_controller_1.default.getTransactions);
router.get('/latest/:userId', transaction_controller_1.default.getLatestTransaction);
router.get('/:transactionId', auth_middleware_1.verifyToken, transaction_controller_1.default.getTransactionById);
router.patch('/:transactionId', auth_middleware_1.verifyToken, multer_1.uploadPaymentProofImage.single('paymentProofImage'), transaction_controller_1.default.update);
exports.default = router;
