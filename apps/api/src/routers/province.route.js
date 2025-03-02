"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.provinceRouter = void 0;
const express_1 = require("express");
const province_controller_1 = __importDefault(require("../controllers/province.controller"));
const provinceRouter = () => {
    const router = (0, express_1.Router)();
    router.get("/provinces", province_controller_1.default.getProvinces);
    return router;
};
exports.provinceRouter = provinceRouter;
