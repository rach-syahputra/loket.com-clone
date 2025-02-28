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
const review_service_1 = __importDefault(require("../services/review.service"));
class reviewController {
    createReview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, transactionId, eventId } = req.body;
                const result = yield review_service_1.default.createReview(userId, transactionId, Number(eventId));
                res.status(200).send({
                    message: "Review created successfully",
                    result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new reviewController();
