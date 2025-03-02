"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = require("express");
const category_controller_1 = __importDefault(require("../controllers/category.controller"));
const categoryRouter = () => {
    const router = (0, express_1.Router)();
    router.get("/categories", category_controller_1.default.getCategories);
    return router;
};
exports.categoryRouter = categoryRouter;
