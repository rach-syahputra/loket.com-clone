"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const dashboard_controller_1 = __importDefault(require("../controllers/dashboard.controller"));
const router = express_1.default.Router();
router.get('/statistics/sales', auth_middleware_1.verifyToken, dashboard_controller_1.default.getSalesStatistic);
router.get('/summary', auth_middleware_1.verifyToken, dashboard_controller_1.default.getDashboardSumamry);
exports.default = router;
