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
const transaction_repository_1 = __importDefault(require("../repositories/transaction.repository"));
const error_handler_1 = require("../helpers/error.handler");
const event_repository_1 = __importDefault(require("../repositories/event.repository"));
const transaction_validation_1 = require("../validations/transaction.validation");
const validation_handler_1 = require("../helpers/validation.handler");
const image_repository_1 = __importDefault(require("../repositories/image.repository"));
const config_1 = require("../config");
const cloudinary_1 = require("../helpers/cloudinary");
const email_1 = require("../helpers/email/email");
const utils_1 = require("../helpers/utils");
class TransactionService {
    createTransaction(transactionData, paymentProofImage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (paymentProofImage) {
                const transactionPayment = yield image_repository_1.default.upload(paymentProofImage.path, config_1.CLOUDINARY_PAYMENT_PROOF_IMAGE_FOLDER);
                if (transactionPayment && transactionPayment.secure_url) {
                    transactionData.paymentProofImage = transactionPayment.secure_url;
                }
            }
            const transaction = yield transaction_repository_1.default.createTransaction(transactionData);
            return transaction;
        });
    }
    verifyTransactionOwnership(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const transaction = yield transaction_repository_1.default.getTransactionById(req.transactionId);
            if (!transaction)
                throw new error_handler_1.ResponseError(404, 'Transaction not found');
            const event = yield event_repository_1.default.getEventById((_a = transaction.event) === null || _a === void 0 ? void 0 : _a.id);
            if ((event === null || event === void 0 ? void 0 : event.organizerId) !== req.organizerId)
                throw new error_handler_1.ResponseError(401, 'Unauthorized');
        });
    }
    getTransactions(organizerId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield transaction_repository_1.default.getTransactions(organizerId, query);
        });
    }
    getTransactionById(transactionId, organizerId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyTransactionOwnership({ transactionId, organizerId });
            const transaction = yield transaction_repository_1.default.getTransactionById(transactionId);
            return {
                transaction
            };
        });
    }
    updateTransaction(req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_handler_1.validate)(transaction_validation_1.UpdateTransactionSchema, req);
            yield this.verifyTransactionOwnership({
                organizerId: req.organizerId,
                transactionId: req.transactionId
            });
            let paymentProofImage;
            if (req.paymentProofImage) {
                paymentProofImage = yield image_repository_1.default.upload(req.paymentProofImage.path, config_1.CLOUDINARY_PAYMENT_PROOF_IMAGE_FOLDER);
                if (paymentProofImage) {
                    const transaction = yield transaction_repository_1.default.getTransactionById(req.transactionId);
                    if ((transaction === null || transaction === void 0 ? void 0 : transaction.paymentProofImage) &&
                        transaction.paymentProofImage.includes('res.cloudinary.com')) {
                        const publicId = (0, cloudinary_1.getPublicId)(transaction.paymentProofImage);
                        const deletedPaymentProofImage = yield image_repository_1.default.delete(publicId);
                        if (deletedPaymentProofImage.result !== 'ok') {
                            yield image_repository_1.default.delete(paymentProofImage.public_id);
                            throw new error_handler_1.ResponseError(400, 'Uploading payment proof image failed');
                        }
                    }
                }
            }
            const updatedTransaction = yield transaction_repository_1.default.updateTransaction({
                transactionId: Number(req.transactionId),
                transactionStatus: req.transactionStatus,
                paymentProofImage: paymentProofImage === null || paymentProofImage === void 0 ? void 0 : paymentProofImage.secure_url,
                quantity: Number(req.quantity),
                totalPrice: Number(req.totalPrice)
            });
            const { id, transactionStatus, user, event, createdAt, totalPrice } = updatedTransaction;
            // Send email to customer for accepted or rejected payment
            if (transactionStatus === 'DONE' || transactionStatus === 'REJECTED') {
                yield (0, email_1.sendPaymentEmail)(user.email, transactionStatus, {
                    transactionId: id.toString(),
                    transactionDateTime: (0, utils_1.formatDateWithTime)(new Date(createdAt)),
                    eventTitle: event.title,
                    customerName: user.name,
                    eventSchedule: (0, utils_1.formatEventDate)(event.eventStartDate, event.eventEndDate, event.eventStartTime, event.eventEndTime),
                    eventLocation: (0, utils_1.formatEventLocation)(event.location.streetAddress, event.location.city, event.location.province.name),
                    totalPrice: (0, utils_1.formatPrice)(totalPrice)
                });
            }
            return {
                transaction: updatedTransaction
            };
        });
    }
    getReviews(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield transaction_repository_1.default.getReviews(userId);
        });
    }
    getLatestTransactionForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield transaction_repository_1.default.getLatestTransactionByUser(userId);
        });
    }
}
exports.default = new TransactionService();
