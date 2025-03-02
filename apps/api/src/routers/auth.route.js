"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post('/new', auth_controller_1.default.register);
router.post('/new/request', auth_controller_1.default.registerRequest);
router.post('/', auth_controller_1.default.login);
router.get('/refresh-token', auth_middleware_1.verifyToken, auth_controller_1.default.refreshToken);
router.post('/role-switch', auth_middleware_1.verifyToken, auth_controller_1.default.switchUserRole);
router.get('/:email/password-recovery', auth_controller_1.default.confirmEmailForPasswordReset);
router.patch('/:email/password-recovery', auth_controller_1.default.resetPassword);
exports.default = router;
