"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRouter = void 0;
const express_1 = require("express");
const event_controller_1 = __importDefault(require("../controllers/event.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_1 = require("../helpers/multer");
const eventRouter = () => {
    const router = (0, express_1.Router)();
    router.post('/eventcreate', multer_1.uploadEventBanner.single('banner'), event_controller_1.default.createEvent);
    router.get('/event', event_controller_1.default.getEvent);
    router.get('/event/:slug', event_controller_1.default.getEventBySlug);
    router.get('/event/:eventId/transaction', event_controller_1.default.getEventById);
    router.get('/events/reviews', event_controller_1.default.getEventsWithoutReviews);
    router.get('/events/filter', event_controller_1.default.filterAll);
    router.patch('/events/:eventId', auth_middleware_1.verifyToken, multer_1.uploadEventBanner.single('banner'), event_controller_1.default.updateEvent);
    return router;
};
exports.eventRouter = eventRouter;
