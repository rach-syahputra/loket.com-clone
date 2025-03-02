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
const client_1 = require("@prisma/client");
class EventRepository {
    createEvent(eventData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.event.create({
                data: eventData
            });
        });
    }
    createLocation(locationData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.location.create({
                data: locationData
            });
        });
    }
    getAllEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.event.findMany({
                include: { location: true, organizer: true }
            });
        });
    }
    getEventById(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.event.findUnique({
                where: {
                    id: eventId
                }
            });
        });
    }
    getEventsWithoutReviews(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.event.findMany({
                where: {
                    Review: {
                        none: {
                            userId: { equals: userId }
                        }
                    }
                }
            });
        });
    }
    updateEvent(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.$transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e;
                if ((_a = req.location) === null || _a === void 0 ? void 0 : _a.id) {
                    yield trx.location.update({
                        data: {
                            provinceId: (_b = req.location) === null || _b === void 0 ? void 0 : _b.provinceId,
                            streetAddress: (_c = req.location) === null || _c === void 0 ? void 0 : _c.streetAddress,
                            city: (_d = req.location) === null || _d === void 0 ? void 0 : _d.city
                        },
                        where: {
                            id: (_e = req.location) === null || _e === void 0 ? void 0 : _e.id
                        }
                    });
                }
                const event = yield trx.event.update({
                    data: {
                        title: req.title,
                        slug: req.title ? (0, utils_1.generateSlug)(req.title) : undefined,
                        description: req.description,
                        bannerUrl: req.banner,
                        availableSeats: req.availableSeats,
                        registrationStartDate: req.registrationStartDate,
                        registrationEndDate: req.registrationEndDate,
                        eventStartDate: req.eventStartDate,
                        eventEndDate: req.eventEndDate,
                        eventStartTime: req.eventStartTime,
                        eventEndTime: req.eventEndTime,
                        price: req.price,
                        ticketType: req.ticketType,
                        categoryId: req.categoryId
                    },
                    where: {
                        id: req.eventId
                    },
                    omit: {
                        locationId: true
                    },
                    include: {
                        location: {
                            include: {
                                province: true
                            }
                        }
                    }
                });
                return event;
            }));
        });
    }
    getEventBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.event.findUnique({
                where: {
                    slug
                },
                include: { location: true, organizer: true }
            });
        });
    }
    filterAll(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const titleCondition = filters.search
                ? {
                    title: {
                        contains: filters.search,
                        mode: client_1.Prisma.QueryMode.insensitive
                    }
                }
                : {};
            const events = yield prisma_1.prisma.event.findMany({
                where: Object.assign(Object.assign({}, titleCondition), { location: filters.provinceId
                        ? { provinceId: filters.provinceId }
                        : undefined, categoryId: filters.categoryId ? filters.categoryId : undefined, ticketType: filters.ticketType ? filters.ticketType : undefined }),
                include: {
                    organizer: true
                }
            });
            return events;
        });
    }
}
exports.default = new EventRepository();
