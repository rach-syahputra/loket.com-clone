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
const error_handler_1 = require("../helpers/error.handler");
const validation_handler_1 = require("../helpers/validation.handler");
const organizer_repository_1 = __importDefault(require("../repositories/organizer.repository"));
const organizer_validation_1 = require("../validations/organizer.validation");
class OrganizerService {
    getPastEvents(organizerId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield organizer_repository_1.default.getPastEvents(organizerId, query);
        });
    }
    getActiveEvents(organizerId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield organizer_repository_1.default.getActiveEvents(organizerId, query);
        });
    }
    getEventAttendees(slug, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield organizer_repository_1.default.getEventAttendees(slug, query);
        });
    }
    verifyEventOwnership(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield organizer_repository_1.default.getEventBySlug(req.slug);
            if (!event)
                throw new error_handler_1.ResponseError(404, 'Event not found');
            if ((event === null || event === void 0 ? void 0 : event.organizerId) !== req.organizerId)
                throw new error_handler_1.ResponseError(401, 'Unauthorized');
        });
    }
    getEventBySlug(req) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_handler_1.validate)(organizer_validation_1.GetEventBySlugSchema, req);
            yield this.verifyEventOwnership(req);
            const event = yield organizer_repository_1.default.getEventBySlug(req.slug);
            return {
                event
            };
        });
    }
}
exports.default = new OrganizerService();
