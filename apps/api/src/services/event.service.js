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
const event_repository_1 = __importDefault(require("../repositories/event.repository"));
const prisma_1 = require("../helpers/prisma");
const validation_handler_1 = require("../helpers/validation.handler");
const event_validation_1 = require("../validations/event.validation");
const error_handler_1 = require("../helpers/error.handler");
const cloudinary_1 = require("../helpers/cloudinary");
const image_repository_1 = __importDefault(require("../repositories/image.repository"));
const config_1 = require("../config");
class EventService {
    createEventWithLocation(eventData, locationData, bannerFile) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.prisma.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                const location = yield event_repository_1.default.createLocation(locationData);
                if (bannerFile) {
                    const eventBanner = yield image_repository_1.default.upload(bannerFile.path, config_1.CLOUDINARY_EVENT_BANNER_FOLDER);
                    if (eventBanner && eventBanner.secure_url) {
                        eventData.bannerUrl = eventBanner.secure_url;
                    }
                }
                const event = yield event_repository_1.default.createEvent(Object.assign(Object.assign({}, eventData), { locationId: location.id }));
                return { event, location };
            }));
        });
    }
    getAllEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield event_repository_1.default.getAllEvents();
        });
    }
    getEventById(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield event_repository_1.default.getEventById(eventId);
        });
    }
    getEventBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield event_repository_1.default.getEventBySlug(slug);
        });
    }
    filterAll(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield event_repository_1.default.filterAll(filters);
        });
    }
    getEventsWithoutReviews(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield event_repository_1.default.getEventsWithoutReviews(userId);
        });
    }
    verifyEventOwnership(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield event_repository_1.default.getEventById(req.eventId);
            if ((event === null || event === void 0 ? void 0 : event.organizerId) !== req.organizerId)
                throw new error_handler_1.ResponseError(401, 'Unauthorized');
        });
    }
    updateEvent(req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_handler_1.validate)(event_validation_1.UpdateEventSchema, req);
            yield this.verifyEventOwnership({
                eventId: req.eventId,
                organizerId: req.organizerId
            });
            let eventBanner;
            if (req.banner) {
                eventBanner = yield image_repository_1.default.upload(req.banner.path, config_1.CLOUDINARY_EVENT_BANNER_FOLDER);
                if (eventBanner) {
                    const event = yield event_repository_1.default.getEventById(req.eventId);
                    if ((event === null || event === void 0 ? void 0 : event.bannerUrl) &&
                        event.bannerUrl.includes('res.cloudinary.com')) {
                        const publicId = (0, cloudinary_1.getPublicId)(event.bannerUrl);
                        const deletedBanner = yield image_repository_1.default.delete(publicId);
                        if (deletedBanner.result !== 'ok') {
                            yield image_repository_1.default.delete(eventBanner.public_id);
                            throw new error_handler_1.ResponseError(400, 'Uploading image failed');
                        }
                    }
                }
            }
            let location;
            if (req.locationId) {
                location = {
                    id: req.locationId,
                    city: req.city,
                    streetAddress: req.streetAddress,
                    provinceId: req.provinceId
                };
            }
            const updatedEvent = yield event_repository_1.default.updateEvent(Object.assign(Object.assign({}, req), { banner: eventBanner === null || eventBanner === void 0 ? void 0 : eventBanner.secure_url, location }));
            return {
                event: updatedEvent
            };
        });
    }
}
exports.default = new EventService();
