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
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../helpers/prisma");
class OrganizerRepository {
    getPastEvents(organizerId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 4;
            const ORDER_TYPES = ['asc', 'desc'];
            const [totalEvents, pastEvents] = yield prisma_1.prisma.$transaction([
                prisma_1.prisma.event.count({
                    where: {
                        organizerId: organizerId,
                        eventEndDate: { lt: new Date() }
                    }
                }),
                prisma_1.prisma.event.findMany({
                    where: {
                        organizerId: organizerId,
                        eventEndDate: { lt: new Date() }
                    },
                    orderBy: {
                        eventStartDate: ORDER_TYPES.includes(query.order)
                            ? query.order
                            : 'desc'
                    },
                    omit: {
                        locationId: true
                    },
                    include: {
                        location: {
                            omit: { provinceId: true },
                            include: {
                                province: true
                            }
                        },
                        Transactions: {
                            include: {
                                user: true
                            },
                            where: {
                                transactionStatus: 'DONE'
                            }
                        }
                    },
                    take: limit,
                    skip: ((query.page ? query.page : 1) - 1) * limit
                })
            ]);
            const formatedEventData = pastEvents.map((event) => (Object.assign(Object.assign({}, event), { ticketSold: event.Transactions.length, totalPrice: event.Transactions.reduce((sum, t) => sum + t.totalPrice, 0), attendees: event.Transactions.map((t) => ({
                    id: t.userId,
                    name: t.user.name,
                    ticketQuantity: 1,
                    totalPrice: t.totalPrice
                })) })));
            return {
                events: formatedEventData,
                pagination: {
                    currentPage: query.page,
                    totalPages: Math.ceil(totalEvents / limit),
                    limit
                },
                totalEvents
            };
        });
    }
    getActiveEvents(organizerId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 4;
            const ORDER_TYPES = ['asc', 'desc'];
            const [totalEvents, activeEvents] = yield prisma_1.prisma.$transaction([
                prisma_1.prisma.event.count({
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
                }),
                prisma_1.prisma.event.findMany({
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
                    },
                    orderBy: {
                        eventStartDate: ORDER_TYPES.includes(query.order)
                            ? query.order
                            : 'desc'
                    },
                    omit: {
                        locationId: true
                    },
                    include: {
                        location: {
                            omit: { provinceId: true },
                            include: {
                                province: true
                            }
                        },
                        Transactions: {
                            include: {
                                user: true
                            },
                            where: {
                                transactionStatus: 'DONE'
                            }
                        }
                    },
                    take: limit,
                    skip: ((query.page ? query.page : 1) - 1) * limit
                })
            ]);
            const formatedEventData = activeEvents.map((event) => (Object.assign(Object.assign({}, event), { ticketSold: event.Transactions.length, totalPrice: event.Transactions.reduce((sum, t) => sum + t.totalPrice, 0), attendees: event.Transactions.map((t) => ({
                    id: t.userId,
                    name: t.user.name,
                    ticketQuantity: 1,
                    totalPrice: t.totalPrice
                })) })));
            return {
                events: formatedEventData.map((_a) => {
                    var { Transactions } = _a, event = __rest(_a, ["Transactions"]);
                    return event;
                }), // Omit Transactions key
                pagination: {
                    currentPage: query.page,
                    totalPages: Math.ceil(totalEvents / limit),
                    limit
                },
                totalEvents
            };
        });
    }
    getEventBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield prisma_1.prisma.event.findUnique({
                where: {
                    slug
                },
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
            });
            return event;
        });
    }
    getEventAttendees(slug, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 8;
            const ORDER_TYPES = ['asc', 'desc'];
            const totalAttendees = yield prisma_1.prisma.transactions.count({
                where: {
                    event: {
                        slug
                    },
                    transactionStatus: 'DONE'
                }
            });
            const attendees = yield prisma_1.prisma.event.findUnique({
                where: {
                    slug
                },
                include: {
                    Transactions: {
                        include: {
                            user: true
                        },
                        where: {
                            transactionStatus: 'DONE'
                        },
                        orderBy: {
                            createdAt: ORDER_TYPES.includes(query.order) ? query.order : 'desc'
                        },
                        take: limit,
                        skip: ((query.page ? query.page : 1) - 1) * limit
                    }
                }
            });
            return {
                attendees: attendees === null || attendees === void 0 ? void 0 : attendees.Transactions.map((t) => ({
                    id: t.userId,
                    name: t.user.name,
                    ticketQuantity: 1,
                    totalPrice: t.totalPrice
                })),
                pagination: {
                    currentPage: query.page ? query.page : 1,
                    totalPages: totalAttendees ? Math.ceil(totalAttendees / limit) : limit,
                    limit
                },
                totalAttendees
            };
        });
    }
}
exports.default = new OrganizerRepository();
