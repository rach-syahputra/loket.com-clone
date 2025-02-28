"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    registerRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield auth_service_1.default.registerRequest(req.body.email);
                res.status(201).json({
                    success: true,
                    message: 'Registration request success.',
                    data
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield auth_service_1.default.register(req.body);
                res.status(201).json({
                    success: true,
                    message: 'User registered successfully.',
                    data
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield auth_service_1.default.login(req.body);
                res.status(200).json({
                    success: true,
                    message: 'User logged in successfully.',
                    data
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = yield auth_service_1.default.refreshToken((_a = req.user) === null || _a === void 0 ? void 0 : _a.email);
                res.status(200).json({
                    success: true,
                    message: 'Refresh token success.',
                    data
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    confirmEmailForPasswordReset(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield auth_service_1.default.confirEmailForPasswordReset(req.params.email);
                res.status(200).json({
                    success: true,
                    message: 'User confirmed successfully.'
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield auth_service_1.default.resetPassword({
                    email: req.params.email,
                    password: req.body.password
                });
                res.status(200).json({
                    success: true,
                    message: 'Password updated successfully.'
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    switchUserRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (req.user) {
                    const data = yield auth_service_1.default.switchUserRole({
                        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                        roleId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.roleId
                    });
                    res.status(200).json({
                        success: true,
                        message: 'User role switched successfully.',
                        data
                    });
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = new AuthController();
