"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRouter = void 0;
const express_1 = require("express");
const review_controller_1 = __importDefault(require("../controllers/review.controller"));
const transaction_controller_1 = __importDefault(require("../controllers/transaction.controller"));
const reviewRouter = () => {
    const router = (0, express_1.Router)();
    router.post("/reviews", transaction_controller_1.default.getReviews);
    router.get("/reviews", transaction_controller_1.default.getReviews);
    router.post("/review/create", review_controller_1.default.createReview);
    return router;
};
exports.reviewRouter = reviewRouter;
