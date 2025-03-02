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
const user_service_1 = __importDefault(require("../services/user.service"));
const error_handler_1 = require("../helpers/error.handler");
class UserController {
    verifyPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                yield user_service_1.default.verifyPassword(Object.assign(Object.assign({}, req.body), { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }));
                res.status(200).json({
                    success: true,
                    message: 'Password matches.'
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const data = yield user_service_1.default.update(Object.assign(Object.assign({}, req.body), { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, roleId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.roleId, image: req.file }));
                res.status(200).json({
                    success: true,
                    message: 'User updated successfully.',
                    data
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getCoupons(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) {
                    const { page, order } = req.query;
                    const data = yield user_service_1.default.getCoupons(req.user.id, {
                        page: Number(page),
                        order: order
                    });
                    res.status(200).json({
                        success: true,
                        message: 'Coupons retrieved successfully.',
                        data
                    });
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
    getTickets(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    if (req.user.roleId !== 1)
                        throw new error_handler_1.ResponseError(401, 'Unauthorized');
                    const { status, page, order } = req.query;
                    const data = yield user_service_1.default.getTickets({
                        userId: req.user.id,
                        query: {
                            order: order,
                            status: status,
                            page: Number(page)
                        }
                    });
                    res.status(200).json({
                        success: true,
                        message: 'Tickets retrieved successfully.',
                        data
                    });
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
    updateCoupons(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { pointId } = req.body;
                const result = yield user_service_1.default.updateCoupon(pointId);
                res.status(200).send({
                    message: 'Coupons updated successfully',
                    result
                });
            }
            catch (error) { }
        });
    }
    getEVoucher(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { eVoucherId } = req.params;
                if (!eVoucherId)
                    throw new error_handler_1.ResponseError(400, 'E-Voucher ID is required');
                const data = yield user_service_1.default.getEVoucher(Number(eVoucherId), Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id));
                res.status(200).send({
                    success: true,
                    message: 'E-Voucher retrieved successfully',
                    data
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new UserController();
