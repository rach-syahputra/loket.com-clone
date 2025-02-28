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
const voucher_service_1 = __importDefault(require("../services/voucher.service"));
class VoucherController {
    createVoucher(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, eventId, discountAmount, startDate, endDate } = req.body;
                const voucherData = {
                    title: String(title),
                    eventId: Number(eventId),
                    discountAmount: Number(discountAmount),
                    startDate: new Date(startDate),
                    endDate: new Date(endDate)
                };
                const result = yield voucher_service_1.default.createVoucher(voucherData);
                res.status(200).send({
                    message: "Voucher created successfully",
                    result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getVoucherByEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.params;
                const result = yield voucher_service_1.default.getVoucherByEvent(Number(eventId));
                res.status(200).send({
                    message: "Voucher by event fetched successfully",
                    result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new VoucherController();
