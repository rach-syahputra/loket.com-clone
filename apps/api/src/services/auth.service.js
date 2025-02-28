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
const auth_repository_1 = __importDefault(require("../repositories/auth.repository"));
const validation_handler_1 = require("../helpers/validation.handler");
const auth_validation_1 = require("../validations/auth.validation");
const utils_1 = require("../helpers/utils");
const error_handler_1 = require("../helpers/error.handler");
const jwt_handler_1 = require("../helpers/jwt.handler");
const email_1 = require("../helpers/email/email");
class AuthService {
    registerRequest(email) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_handler_1.validate)(auth_validation_1.RegisterRequestSchema, { email });
            const verificationCode = (0, utils_1.generateVerificationCode)();
            const token = yield (0, jwt_handler_1.putAccessTokenForRegistration)(email);
            yield (0, email_1.sendRegisterVerificationEmail)(email, {
                email,
                token
            });
            return {
                token
            };
        });
    }
    register(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // REGISTER FLOW:
            // 1. Validate the request.
            // 2. Hash the password.
            // 3. begin sql transaction.
            //    - insert new user to user table.
            //    - insert new user's roles to user_roles table.
            //    - if a referral code is provided:
            //      • insert coupons for the referrer/new user.
            //      • insert coupons for the referred user.
            // 4. commit the sql transaction.
            (0, validation_handler_1.validate)(auth_validation_1.RegisterSchema, req);
            const registeredUser = yield auth_repository_1.default.findUserByEmail(req.email);
            if (registeredUser)
                throw new error_handler_1.ResponseError(409, 'User already exists');
            if (req.referralCode) {
                const userWithReferralCode = yield auth_repository_1.default.findUserByReferralCode(req.referralCode);
                if (!userWithReferralCode)
                    throw new error_handler_1.ResponseError(400, 'Kode referral tidak valid.');
            }
            req.password = yield (0, utils_1.generateHashedPassword)(req.password);
            const user = yield auth_repository_1.default.register(req);
            return user;
        });
    }
    login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // LOGIN FLOW:
            // 1. Validate the user's credentials.
            // 2. Check if the user exists in the database.
            // 3. Compare the provided password with the stored hash.
            // 4. Retrieve the user's last logged-in role.
            // 5. Generate an access token.
            // 6. Set the userRole's `isActive` status to true in the database.
            (0, validation_handler_1.validate)(auth_validation_1.LoginSchema, req);
            const user = yield auth_repository_1.default.findUserByEmail(req.email);
            const passwordMatch = yield bcrypt_1.default.compare(req.password, (user === null || user === void 0 ? void 0 : user.password) || '');
            if (!passwordMatch)
                throw new error_handler_1.ResponseError(400, 'Invalid credentials.');
            if (user) {
                const lastLoggedInUser = yield auth_repository_1.default.findLastLoggedInRole(user.id);
                if (lastLoggedInUser) {
                    const userData = {
                        id: user.id,
                        email: user.email,
                        roleId: lastLoggedInUser.roleId,
                        name: user.name,
                        image: user.pictureUrl,
                        referralCode: user.referralCode
                    };
                    const accessToken = yield (0, jwt_handler_1.putAccessToken)(userData);
                    if (accessToken) {
                        yield auth_repository_1.default.updateUserRole({
                            userId: lastLoggedInUser.userId,
                            roleId: lastLoggedInUser.roleId,
                            isActive: true
                        });
                        return {
                            accessToken
                        };
                    }
                    else {
                        throw new error_handler_1.ResponseError(500, 'Unable to generate access token.');
                    }
                }
            }
        });
    }
    refreshToken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_repository_1.default.findUserByEmail(email);
            if (user) {
                const lastLoggedInUser = yield auth_repository_1.default.findLastLoggedInRole(user.id);
                if (lastLoggedInUser) {
                    const userData = {
                        id: user.id,
                        email: user.email,
                        roleId: lastLoggedInUser === null || lastLoggedInUser === void 0 ? void 0 : lastLoggedInUser.roleId,
                        name: user.name,
                        image: user.pictureUrl,
                        referralCode: user.referralCode
                    };
                    const accessToken = yield (0, jwt_handler_1.putAccessToken)(userData);
                    if (accessToken) {
                        yield auth_repository_1.default.updateUserRole({
                            userId: lastLoggedInUser.userId,
                            roleId: lastLoggedInUser.roleId,
                            isActive: true
                        });
                        return {
                            accessToken
                        };
                    }
                    else {
                        throw new error_handler_1.ResponseError(500, 'Unable to generate access token.');
                    }
                }
            }
        });
    }
    confirEmailForPasswordReset(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_repository_1.default.findUserByEmail(email);
            if (!user)
                throw new error_handler_1.ResponseError(404, 'User not found');
            const accessToken = yield (0, jwt_handler_1.putAccessTokenForPasswordReset)(user.email);
            yield (0, email_1.sendPasswordResetEmail)(user.email, {
                name: user.name,
                token: accessToken
            });
        });
    }
    resetPassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_handler_1.validate)(auth_validation_1.ResetPasswordSchema, { password: req.password });
            req.password = yield (0, utils_1.generateHashedPassword)(req.password);
            return yield auth_repository_1.default.updatePassword(req);
        });
    }
    switchUserRole(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // SWITCH USER ROLE FLOW
            // 1. begin sql transaction
            //  - Set the userRole's `isActive` to false for current role
            //  - Set the userRole's `isActive` to true for next role
            // 2. commit the sql transaction
            const user = yield auth_repository_1.default.switchUserRole({
                userId: req.userId,
                currentRoleId: req.roleId,
                nextRoleId: req.roleId === 1 ? 2 : 1
            });
            if (user) {
                const accessToken = yield (0, jwt_handler_1.putAccessToken)({
                    id: user.id,
                    email: user.email,
                    roleId: user.roleId,
                    name: user.name,
                    image: user.image || '',
                    referralCode: user.referralCode || ''
                });
                if (accessToken) {
                    return { accessToken };
                }
                else {
                    throw new error_handler_1.ResponseError(500, 'Unable to generate access token.');
                }
            }
        });
    }
}
exports.default = new AuthService();
