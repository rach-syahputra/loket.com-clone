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
const error_handler_1 = require("../helpers/error.handler");
const dashboard_service_1 = __importDefault(require("../services/dashboard.service"));
class DashboardController {
    getDashboardSumamry(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.roleId) !== 2)
                    throw new error_handler_1.ResponseError(401, 'Unauthorized');
                const data = yield dashboard_service_1.default.getDashboardSummary((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
                res.status(200).json({
                    success: true,
                    message: 'Dashboard summary retrieved.',
                    data
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    getSalesStatistic(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.roleId) !== 2)
                    throw new error_handler_1.ResponseError(401, 'Unauthorized');
                const data = yield dashboard_service_1.default.getSalesStatistic((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
                res.status(200).json({
                    success: true,
                    message: 'Sales retrieved.',
                    data
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = new DashboardController();
