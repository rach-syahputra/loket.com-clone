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
class UserRepository {
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield prisma_1.prisma.user.findUnique({
                where: {
                    id
                }
            });
            return res;
        });
    }
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield prisma_1.prisma.user.update({
                data: {
                    name: req.name,
                    password: req.password,
                    pictureUrl: req.image
                },
                where: {
                    id: req.id
                }
            });
            return {
                id: res.id,
                name: res.name,
                email: res.email,
                pictureUrl: res.pictureUrl,
                updatedAt: res.updatedAt,
                referralCode: res.referralCode
            };
        });
    }
    getCoupons(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 6;
            const ORDER_TYPES = ['asc', 'desc'];
            const [totalCoupons, coupons] = yield prisma_1.prisma.$transaction([
                prisma_1.prisma.coupon.count({
                    where: {
                        userId,
                        status: 'ACTIVE'
                    }
                }),
                prisma_1.prisma.coupon.findMany({
                    where: {
                        userId,
                        status: 'ACTIVE'
                    },
                    orderBy: {
                        expiryDate: ORDER_TYPES.includes(query.order) ? query.order : 'desc'
                    },
                    take: limit,
                    skip: ((query.page ? query.page : 1) - 1) * limit
                })
            ]);
            const totalPages = Math.ceil(totalCoupons / limit);
            return {
                coupons: coupons.map((data) => (Object.assign(Object.assign({}, data), { expiryDate: (0, utils_1.convertToUTC7)(data.expiryDate), createdAt: (0, utils_1.convertToUTC7)(data.createdAt) }))),
                pagination: {
                    currentPage: query.page ? query.page : 1,
                    totalPages,
                    limit: totalCoupons >= limit ? limit : totalCoupons
                },
                totalCoupons
            };
        });
    }
    getTickets(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 4;
            const ORDER_TYPES = ['asc', 'desc'];
            let tickets;
            let totalTickets;
            if (query.status === 'past') {
                totalTickets = yield prisma_1.prisma.transactions.count({
                    where: {
                        userId,
                        event: {
                            eventEndDate: { lt: new Date() }
                        }
                    }
                });
                tickets = yield prisma_1.prisma.transactions.findMany({
                    select: {
                        id: true,
                        userId: true,
                        event: {
                            select: {
                                id: true,
                                title: true,
                                bannerUrl: true,
                                eventStartDate: true,
                                eventStartTime: true,
                                eventEndDate: true,
                                eventEndTime: true
                            }
                        },
                        createdAt: true,
                        transactionStatus: true
                    },
                    where: {
                        userId,
                        event: {
                            eventEndDate: { lt: new Date() }
                        }
                    },
                    orderBy: {
                        createdAt: ORDER_TYPES.includes(query.order) ? query.order : 'desc'
                    },
                    take: limit,
                    skip: ((query.page ? query.page : 1) - 1) * limit
                });
            }
            else {
                totalTickets = yield prisma_1.prisma.transactions.count({
                    where: {
                        userId,
                        event: {
                            OR: [
                                {
                                    registrationStartDate: { lte: new Date() },
                                    registrationEndDate: { gte: new Date() }
                                },
                                {
                                    eventStartDate: { lte: new Date() },
                                    eventEndDate: { gte: new Date() }
                                }
                            ]
                        }
                    }
                });
                tickets = yield prisma_1.prisma.transactions.findMany({
                    select: {
                        id: true,
                        userId: true,
                        event: {
                            select: {
                                id: true,
                                title: true,
                                bannerUrl: true,
                                eventStartDate: true,
                                eventStartTime: true,
                                eventEndDate: true,
                                eventEndTime: true
                            }
                        },
                        createdAt: true,
                        transactionStatus: true
                    },
                    where: {
                        userId,
                        event: {
                            OR: [
                                {
                                    registrationStartDate: { lte: new Date() },
                                    registrationEndDate: { gte: new Date() }
                                },
                                {
                                    eventStartDate: { lte: new Date() },
                                    eventEndDate: { gte: new Date() }
                                }
                            ]
                        }
                    },
                    orderBy: {
                        createdAt: ORDER_TYPES.includes(query.order) ? query.order : 'desc'
                    },
                    take: limit,
                    skip: ((query.page ? query.page : 1) - 1) * limit
                });
            }
            const totalPages = Math.ceil(totalTickets / limit);
            return {
                tickets: tickets.map((ticket) => (Object.assign(Object.assign({}, ticket), { createdAt: (0, utils_1.convertToUTC7)(ticket.createdAt) }))),
                pagination: {
                    currentPage: query.page ? query.page : 1,
                    totalPages,
                    limit: totalPages >= limit ? limit : totalTickets
                },
                totalTickets
            };
        });
    }
    updateCoupon(pointId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.coupon.update({
                where: {
                    id: pointId
                },
                data: {
                    status: 'USED'
                }
            });
        });
    }
    getEVoucher(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.transactions.findUnique({
                where: {
                    id: transactionId
                },
                omit: {
                    eventId: true,
                    userId: true
                },
                include: {
                    event: {
                        omit: {
                            locationId: true
                        },
                        include: {
                            location: {
                                omit: {
                                    provinceId: true
                                },
                                include: {
                                    province: true
                                }
                            }
                        }
                    },
                    user: {
                        omit: {
                            password: true
                        }
                    }
                }
            });
        });
    }
}
exports.default = new UserRepository();
