"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRouter = void 0;
const express_1 = require("express");
const search_controller_1 = __importDefault(require("../controllers/search.controller"));
const searchRouter = () => {
    const router = (0, express_1.Router)();
    router.get('/search', search_controller_1.default.getSearchResults);
    return router;
};
exports.searchRouter = searchRouter;
