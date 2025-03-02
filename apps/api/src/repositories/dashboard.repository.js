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
const contants_1 = require("../helpers/contants");
const prisma_1 = require("../helpers/prisma");
class DashboardRepository {
    getDashboardSummary(organizerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const summary = yield prisma_1.prisma.$transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const totalActiveEvents = yield prisma_1.prisma.event.count({
                    where: {
                        organizerId: organizerId,
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
                });
                const totalPastEvents = yield trx.event.count({
                    where: {
                        organizerId: organizerId,
                        eventEndDate: { lt: new Date() }
                    }
                });
                const totalTransactions = yield trx.transactions.count({
                    where: {
                        event: {
                            organizerId
                        }
                    }
                });
                const totalSoldTickets = yield trx.transactions.count({
                    where: {
                        event: {
                            organizerId
                        },
                        transactionStatus: 'DONE'
                    }
                });
                const totalPrices = yield trx.transactions.findMany({
                    select: {
                        totalPrice: true
                    },
                    where: {
                        event: {
                            organizerId
                        },
                        transactionStatus: 'DONE'
                    }
                });
                const totalSales = totalPrices.reduce((sum, transaction) => sum + transaction.totalPrice, 0);
                return {
                    totalPastEvents,
                    totalActiveEvents,
                    totalTransactions,
                    totalSoldTickets,
                    totalSales
                };
            }));
            return summary;
        });
    }
    getSalesStatistic(organizerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield prisma_1.prisma.transactions.findMany({
                select: { totalPrice: true, createdAt: true },
                where: {
                    event: {
                        organizerId
                    }
                }
            });
            const sales = transactions.reduce((acc, trx) => {
                const date = new Date(trx.createdAt);
                const year = date.getFullYear().toString();
                const month = date.toLocaleString('id-ID', { month: 'long' });
                // Find or create year group
                let yearGroup = acc.find((group) => group.year === year);
                if (!yearGroup) {
                    yearGroup = {
                        year,
                        data: contants_1.MONTHS.map((m) => ({ month: m, total: 0 })) // Pre-fill all months with 0
                    };
                    acc.push(yearGroup);
                }
                // Find the month and update total
                let monthData = yearGroup.data.find((item) => item.month === month);
                if (monthData) {
                    monthData.total += trx.totalPrice;
                }
                return acc;
            }, []);
            return sales;
        });
    }
}
exports.default = new DashboardRepository();
