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
class TransactionRepository {
    createTransaction(transactionData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.transactions.create({
                data: transactionData
            });
        });
    }
    getTransactions(organizerId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 8;
            const ORDER_TYPES = ['asc', 'desc'];
            const [totalTransactions, transactions] = yield prisma_1.prisma.$transaction([
                prisma_1.prisma.transactions.count({
                    where: {
                        event: {
                            organizerId
                        },
                        transactionStatus: {
                            in: query.status
                        }
                    }
                }),
                prisma_1.prisma.transactions.findMany({
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                pictureUrl: true,
                                name: true
                            }
                        },
                        event: {
                            select: {
                                id: true,
                                title: true,
                                slug: true
                            }
                        }
                    },
                    omit: {
                        userId: true,
                        eventId: true
                    },
                    where: {
                        event: {
                            organizerId
                        },
                        transactionStatus: {
                            in: query.status
                        }
                    },
                    orderBy: {
                        updatedAt: ORDER_TYPES.includes(query.order) ? query.order : 'desc'
                    },
                    take: limit,
                    skip: ((query.page ? query.page : 1) - 1) * limit
                })
            ]);
            return {
                transactions: transactions.map((transaction) => (Object.assign(Object.assign({}, transaction), { createdAt: (0, utils_1.convertToUTC7)(transaction.createdAt), updatedAt: (0, utils_1.convertToUTC7)(transaction.updatedAt) }))),
                pagination: {
                    currentPage: query.page || 1,
                    totalPages: Math.ceil(totalTransactions / limit),
                    limit: totalTransactions >= limit ? limit : totalTransactions
                },
                totalTransactions
            };
        });
    }
    getTransactionById(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield prisma_1.prisma.transactions.findUnique({
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
            return Object.assign(Object.assign({}, transaction), { createdAt: (0, utils_1.convertToUTC7)(transaction === null || transaction === void 0 ? void 0 : transaction.createdAt), updatedAt: (0, utils_1.convertToUTC7)(transaction === null || transaction === void 0 ? void 0 : transaction.updatedAt) });
        });
    }
    updateTransaction(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield prisma_1.prisma.$transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const transaction = yield trx.transactions.findUnique({
                    where: {
                        id: req.transactionId
                    },
                    select: {
                        eventId: true,
                        couponId: true,
                        createdAt: true
                    }
                });
                if (transaction) {
                    if (req.transactionStatus === 'REJECTED' ||
                        req.transactionStatus === 'CANCELED') {
                        // If coupon is used on the transaction, restore the coupon status to 'ACTIVE'
                        if (transaction.couponId) {
                            yield trx.coupon.update({
                                where: {
                                    id: transaction.couponId
                                },
                                data: {
                                    status: 'ACTIVE'
                                }
                            });
                        }
                        // Restore the event available seats
                        yield trx.event.update({
                            where: {
                                id: transaction.eventId
                            },
                            data: {
                                availableSeats: {
                                    increment: 1
                                }
                            }
                        });
                    }
                    const createdAt = new Date(transaction.createdAt);
                    const twentySecondsAgo = new Date(Date.now() - 20 * 1000);
                    if (req.transactionStatus === 'WAITING_FOR_PAYMENT' &&
                        !req.paymentProofImage &&
                        new Date(createdAt) < twentySecondsAgo) {
                        req.transactionStatus = 'EXPIRED';
                    }
                    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
                    if (req.transactionStatus === 'WAITING_FOR_ADMIN_CONFIRMATION' &&
                        new Date(createdAt) < threeDaysAgo) {
                        req.transactionStatus = 'CANCELED';
                    }
                    if (req.transactionStatus === 'WAITING_FOR_PAYMENT') {
                        yield trx.event.update({
                            where: {
                                id: transaction.eventId
                            },
                            data: {
                                availableSeats: {
                                    decrement: req.quantity
                                }
                            }
                        });
                    }
                }
                return yield trx.transactions.update({
                    where: {
                        id: req.transactionId
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                name: true
                            }
                        },
                        event: {
                            include: {
                                location: {
                                    include: {
                                        province: true
                                    },
                                    omit: {
                                        provinceId: true
                                    }
                                }
                            },
                            omit: {
                                locationId: true
                            }
                        }
                    },
                    omit: {
                        userId: true,
                        eventId: true
                    },
                    data: {
                        paymentProofImage: req.paymentProofImage,
                        transactionStatus: req.transactionStatus,
                        totalPrice: req.totalPrice
                    }
                });
            }));
            return Object.assign(Object.assign({}, transaction), { createdAt: (0, utils_1.convertToUTC7)(transaction.createdAt), updatedAt: (0, utils_1.convertToUTC7)(transaction.updatedAt) });
        });
    }
    getReviews(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDateTime = new Date();
            return yield prisma_1.prisma.transactions.findMany({
                where: {
                    userId: userId,
                    transactionStatus: 'DONE',
                    event: {
                        eventEndDate: { lte: currentDateTime },
                        eventEndTime: { lte: currentDateTime.toTimeString().split(' ')[0] }
                    },
                    OR: [{ review: null }, { review: { status: 'DRAFT' } }]
                },
                select: {
                    event: {
                        select: {
                            id: true,
                            title: true,
                            eventStartDate: true,
                            eventEndDate: true,
                            eventStartTime: true,
                            eventEndTime: true
                        }
                    },
                    review: {
                        select: {
                            id: true,
                            status: true,
                            content: true,
                            rating: true
                        }
                    }
                }
            });
        });
    }
    getLatestTransactionByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.transactions.findFirst({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });
        });
    }
}
exports.default = new TransactionRepository();
