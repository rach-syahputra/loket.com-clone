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
const bcrypt_1 = __importDefault(require("bcrypt"));
const cloudinary_1 = require("../helpers/cloudinary");
const error_handler_1 = require("../helpers/error.handler");
const utils_1 = require("../helpers/utils");
const validation_handler_1 = require("../helpers/validation.handler");
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const user_validation_1 = require("../validations/user.validation");
const jwt_handler_1 = require("../helpers/jwt.handler");
const image_repository_1 = __importDefault(require("../repositories/image.repository"));
const config_1 = require("../config");
class UserService {
    verifyPassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_handler_1.validate)(user_validation_1.VerifyPasswordSchema, req);
            const user = yield user_repository_1.default.findById(req.id);
            const passwordMatch = yield bcrypt_1.default.compare(req.password, (user === null || user === void 0 ? void 0 : user.password) || '');
            if (!passwordMatch)
                throw new error_handler_1.ResponseError(400, `Password doesn't match`);
        });
    }
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // UPDATE USER FLOW
            // 1. Validate the user's request.
            // 2. If image file is provided
            //    - Upload new image file to cloudinary
            //    - Delete current image file from cloudinary
            // 3. If password is provided
            //    - Hash the provided password
            // 4. Update the user data with new data
            (0, validation_handler_1.validate)(user_validation_1.UpdateUserSchema, req);
            let userImage;
            if (req.image) {
                userImage = yield image_repository_1.default.upload(req.image.path, config_1.CLOUDINARY_USER_PROFILE_IMAGE_FOLDER);
                if (userImage) {
                    const user = yield user_repository_1.default.findById(req.id);
                    if ((user === null || user === void 0 ? void 0 : user.pictureUrl) &&
                        user.pictureUrl.includes('res.cloudinary.com')) {
                        const publicId = (0, cloudinary_1.getPublicId)(user.pictureUrl);
                        const deletedImage = yield image_repository_1.default.delete(publicId);
                        if (deletedImage.result !== 'ok') {
                            yield image_repository_1.default.delete(userImage.public_id);
                            throw new error_handler_1.ResponseError(400, 'Uploading image failed');
                        }
                    }
                }
            }
            if (req.password)
                req.password = yield (0, utils_1.generateHashedPassword)(req.password);
            const updatedUser = yield user_repository_1.default.update({
                id: req.id,
                name: req.name,
                password: req.password,
                image: userImage === null || userImage === void 0 ? void 0 : userImage.secure_url
            });
            if (updatedUser) {
                const accessToken = yield (0, jwt_handler_1.putAccessToken)({
                    id: updatedUser.id,
                    email: updatedUser.email,
                    roleId: req.roleId,
                    name: updatedUser.name,
                    image: updatedUser.pictureUrl || '',
                    referralCode: updatedUser.referralCode
                });
                if (accessToken) {
                    return {
                        user: Object.assign(Object.assign({}, updatedUser), { accessToken })
                    };
                }
                else {
                    throw new error_handler_1.ResponseError(500, 'Unable to generate access token.');
                }
            }
        });
    }
    getCoupons(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_repository_1.default.findById(userId);
            if (!user)
                throw new error_handler_1.ResponseError(404, 'User not found');
            const coupons = yield user_repository_1.default.getCoupons(userId, query);
            return {
                user: coupons
            };
        });
    }
    updateCoupon(pointId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_repository_1.default.updateCoupon(pointId);
        });
    }
    getTickets(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const tickets = yield user_repository_1.default.getTickets(req.userId, {
                order: req.query.order,
                page: req.query.page,
                status: req.query.status
            });
            return {
                user: tickets
            };
        });
    }
    verifyEVoucherOwnership(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const eVoucher = yield user_repository_1.default.getEVoucher(req.transactionId);
            if (!eVoucher)
                throw new error_handler_1.ResponseError(404, 'E-Voucher not found');
            const user = yield user_repository_1.default.findById(eVoucher.user.id);
            if ((user === null || user === void 0 ? void 0 : user.id) !== req.customerId)
                throw new error_handler_1.ResponseError(401, 'Unauthorized');
        });
    }
    getEVoucher(transactionId, customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.verifyEVoucherOwnership({ transactionId, customerId });
            const eVoucher = yield user_repository_1.default.getEVoucher(transactionId);
            return {
                eVoucher
            };
        });
    }
}
exports.default = new UserService();
