"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voucherRouter = void 0;
const express_1 = require("express");
const voucher_controller_1 = __importDefault(require("../controllers/voucher.controller"));
const voucherRouter = () => {
    const router = (0, express_1.Router)();
    router.post('/voucher', voucher_controller_1.default.createVoucher);
    router.get("/voucher/:eventId", voucher_controller_1.default.getVoucherByEvent);
    return router;
};
exports.voucherRouter = voucherRouter;
