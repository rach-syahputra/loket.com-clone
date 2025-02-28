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
const organizer_service_1 = __importDefault(require("../services/organizer.service"));
class OrganizerController {
    getEvents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    if (req.user.roleId !== 2)
                        throw new error_handler_1.ResponseError(401, 'Unauthorized.');
                    const { status, page, order } = req.query;
                    let data;
                    if (status === 'aktif')
                        data = yield organizer_service_1.default.getActiveEvents(req.user.id, {
                            page: Number(page),
                            order: order
                        });
                    if (status === 'lalu')
                        data = yield organizer_service_1.default.getPastEvents(req.user.id, {
                            page: Number(page),
                            order: order
                        });
                    res.status(200).json({
                        success: true,
                        message: 'Events retrieved successfully.',
                        data
                    });
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
    getEventAttendees(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    if (req.user.roleId !== 2)
                        throw new error_handler_1.ResponseError(401, 'Unauthorized.');
                    const { slug } = req.params;
                    const { page, order } = req.query;
                    const data = yield organizer_service_1.default.getEventAttendees(slug, {
                        page: Number(page),
                        order: order
                    });
                    res.status(200).json({
                        success: true,
                        message: 'Event attendees retrieved successfully.',
                        data
                    });
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
    getEventBySlug(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.user) {
                    if (req.user.roleId !== 2)
                        throw new error_handler_1.ResponseError(401, 'Unauthorized.');
                    const data = yield organizer_service_1.default.getEventBySlug({
                        organizerId: req.user.id,
                        slug: req.params.slug
                    });
                    res.status(200).json({
                        success: true,
                        message: 'Event retrieved successfully.',
                        data
                    });
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = new OrganizerController();
