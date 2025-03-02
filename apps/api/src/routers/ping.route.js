"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ping_controller_1 = __importDefault(require("../controllers/ping.controller"));
const router = express_1.default.Router();
router.get('/', ping_controller_1.default.ping);
exports.default = router;
