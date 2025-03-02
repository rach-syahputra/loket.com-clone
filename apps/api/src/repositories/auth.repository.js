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
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../helpers/prisma");
const utils_1 = require("../helpers/utils");
class AuthRepository {
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield prisma_1.prisma.user.findUnique({
                where: {
                    email
                }
            });
            return res;
        });
    }
    findLastLoggedInRole(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield prisma_1.prisma.userRole.findFirst({
                where: {
                    userId
                },
                orderBy: {
                    updatedAt: 'desc'
                }
            });
            return res;
        });
    }
    findUserByReferralCode(referralCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield prisma_1.prisma.user.findUnique({
                where: {
                    referralCode
                }
            });
            return res;
        });
    }
    updateUserRole(req) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.prisma.userRole.update({
                data: {
                    isActive: req.isActive
                },
                where: {
                    userId_roleId: {
                        userId: req.userId,
                        roleId: req.roleId
                    }
                }
            });
        });
    }
    updatePassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield prisma_1.prisma.user.update({
                data: {
                    password: req.password
                },
                where: {
                    email: req.email
                }
            });
            return {
                id: res.id,
                name: res.name,
                email: res.email,
                pictureUrl: res.pictureUrl,
                updatedAt: res.updatedAt
            };
        });
    }
    register(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield prisma_1.prisma.$transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const user = yield trx.user.create({
                    data: {
                        email: req.email,
                        password: req.password,
                        name: req.name,
                        referralCode: new Date().valueOf().toString()
                    }
                });
                yield trx.userRole.createMany({
                    data: [
                        {
                            userId: user.id,
                            roleId: 1,
                            isActive: false
                        },
                        {
                            userId: user.id,
                            roleId: 2,
                            isActive: false
                        }
                    ]
                });
                let coupon = null;
                if (req.referralCode) {
                    const referredUser = yield trx.user.findUnique({
                        select: { id: true },
                        where: {
                            referralCode: req.referralCode
                        }
                    });
                    if (referredUser) {
                        // insert coupons for the referrer
                        const coupons = yield trx.coupon.create({
                            data: {
                                discountAmount: 10000,
                                expiryDate: (0, utils_1.calculateCouponsExpiryDate)(),
                                userId: user.id,
                                status: 'ACTIVE'
                            }
                        });
                        // insert coupons for the referred
                        yield trx.coupon.create({
                            data: {
                                discountAmount: 10000,
                                expiryDate: (0, utils_1.calculateCouponsExpiryDate)(),
                                userId: referredUser.id,
                                status: 'ACTIVE'
                            }
                        });
                        // add referral data for the referrer
                        coupon = {
                            id: coupons.id,
                            discountAmount: coupons.discountAmount,
                            status: coupons.status,
                            expiryDate: coupons.expiryDate,
                            createdAt: (0, utils_1.convertToUTC7)(coupons.createdAt)
                        };
                    }
                }
                return {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        pictureUrl: user.pictureUrl,
                        referralCode: user.referralCode,
                        coupon,
                        createdAt: (0, utils_1.convertToUTC7)(user.createdAt),
                        updatedAt: (0, utils_1.convertToUTC7)(user.updatedAt)
                    }
                };
            }));
            return res;
        });
    }
    switchUserRole(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield prisma_1.prisma.$transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                // signing out the current role
                yield trx.userRole.update({
                    data: {
                        isActive: false
                    },
                    where: {
                        userId_roleId: {
                            userId: req.userId,
                            roleId: req.currentRoleId
                        }
                    }
                });
                // signing in the next role
                const nextRole = yield trx.userRole.update({
                    data: {
                        isActive: true
                    },
                    where: {
                        userId_roleId: {
                            userId: req.userId,
                            roleId: req.nextRoleId
                        }
                    }
                });
                const user = yield trx.user.findUnique({
                    where: {
                        id: req.userId
                    }
                });
                if (user) {
                    return {
                        id: user.id,
                        roleId: nextRole.roleId,
                        email: user.email,
                        name: user.name,
                        image: user.pictureUrl || '',
                        referralCode: user.referralCode
                    };
                }
            }));
            return res;
        });
    }
}
exports.default = new AuthRepository();
