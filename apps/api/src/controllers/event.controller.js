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
const event_service_1 = __importDefault(require("../services/event.service"));
class EventController {
    createEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { eventData, locationData } = req.body;
                if (typeof eventData === 'string') {
                    eventData = JSON.parse(eventData);
                }
                if (typeof locationData === 'string') {
                    locationData = JSON.parse(locationData);
                }
                const bannerFile = req.file;
                const result = yield event_service_1.default.createEventWithLocation(eventData, locationData, bannerFile);
                res.status(200).send({
                    message: 'Event created successfully',
                    result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield event_service_1.default.getAllEvents();
                res.status(200).send({
                    message: 'Event retrieved successfully',
                    result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getEventById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = Number(req.params.eventId);
                const result = yield event_service_1.default.getEventById(eventId);
                res.status(200).send({
                    message: 'Event by Id retrieved successfully',
                    result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    filterAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { provinceId, categoryId, ticketType, search } = req.query;
                let parsedProvinceId;
                if (provinceId) {
                    const tmp = parseInt(provinceId, 10);
                    if (!isNaN(tmp)) {
                        parsedProvinceId = tmp;
                    }
                }
                let parsedCategoryId;
                if (categoryId) {
                    const tmp = parseInt(categoryId, 10);
                    if (!isNaN(tmp)) {
                        parsedCategoryId = tmp;
                    }
                }
                const result = yield event_service_1.default.filterAll({
                    provinceId: parsedProvinceId,
                    categoryId: parsedCategoryId,
                    ticketType: ticketType,
                    search: search || ''
                });
                res.status(200).send({
                    message: 'Filter retrieved successfully',
                    result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            var _b, _c, _d, _e, _f, _g, _h, _j, _k;
            try {
                (_b = req.body).availableSeats && (_b.availableSeats = Number(req.body.availableSeats));
                (_c = req.body).categoryId && (_c.categoryId = Number(req.body.categoryId));
                (_d = req.body).locationId && (_d.locationId = Number(req.body.locationId));
                (_e = req.body).provinceId && (_e.provinceId = Number(req.body.provinceId));
                (_f = req.body).price && (_f.price = Number(req.body.price));
                (_g = req.body).registrationStartDate && (_g.registrationStartDate = new Date(req.body.registrationStartDate));
                (_h = req.body).registrationEndDate && (_h.registrationEndDate = new Date(req.body.registrationEndDate));
                (_j = req.body).eventStartDate && (_j.eventStartDate = new Date(req.body.eventStartDate));
                (_k = req.body).eventEndDate && (_k.eventEndDate = new Date(req.body.eventEndDate));
                const data = yield event_service_1.default.updateEvent(Object.assign(Object.assign({}, req.body), { eventId: Number(req.params.eventId), organizerId: Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.id), banner: req.file }));
                res.status(200).send({
                    success: true,
                    message: 'Event updated successfully',
                    data
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getEventBySlug(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slug = req.params.slug;
                const result = yield event_service_1.default.getEventBySlug(slug);
                res.status(200).send({
                    message: 'Detail Event retrieved successfully',
                    result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getEventsWithoutReviews(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.params.userId);
                const result = yield event_service_1.default.getEventsWithoutReviews(userId);
                res.status(200).send({
                    message: "Events Without Reviews Fetched Successfully"
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new EventController();
