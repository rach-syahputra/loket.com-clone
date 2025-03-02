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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_service_1 = __importDefault(require("../services/transaction.service"));
const error_handler_1 = require("../helpers/error.handler");
class TransactionController {
    createTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body, { userId, eventId, totalPrice } = _a, rest = __rest(_a, ["userId", "eventId", "totalPrice"]);
                const transactionData = Object.assign(Object.assign({}, rest), { userId: Number(userId), eventId: Number(eventId), totalPrice: Number(totalPrice) });
                const paymentProofFile = req.file;
                const result = yield transaction_service_1.default.createTransaction(transactionData, paymentProofFile);
                res.status(200).send({
                    message: 'Transaction sent successfully',
                    result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getTransactions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { status, page, order } = req.query;
                const data = yield transaction_service_1.default.getTransactions((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, {
                    status: (typeof status === 'string'
                        ? status.split(',')
                        : Array.isArray(status)
                            ? status
                            : undefined),
                    page: Number(page),
                    order: order
                });
                res.status(200).send({
                    success: true,
                    message: 'Transactions retrieved successfully',
                    data
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getTransactionById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { transactionId } = req.params;
                if (!transactionId)
                    throw new error_handler_1.ResponseError(400, 'Transaction ID is required');
                const data = yield transaction_service_1.default.getTransactionById(Number(transactionId), Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id));
                res.status(200).send({
                    success: true,
                    message: 'Transaction retrieved successfully',
                    data
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = yield transaction_service_1.default.updateTransaction({
                    transactionId: Number(req.params.transactionId),
                    organizerId: Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id),
                    paymentProofImage: req.file,
                    transactionStatus: req.body.transactionStatus,
                    quantity: Number(req.body.quantity),
                    totalPrice: Number(req.body.totalPrice)
                });
                res.status(200).send({
                    success: true,
                    message: 'Transaction updated successfully',
                    data
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getReviews(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.body.userId);
                const result = yield transaction_service_1.default.getReviews(userId);
                res.status(200).send({
                    message: 'reviews fetched successfully',
                    result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getLatestTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.params.userId);
                const result = yield transaction_service_1.default.getLatestTransactionForUser(userId);
                res.status(200).send({
                    message: 'Latest transaction fetched successfully',
                    result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new TransactionController();
