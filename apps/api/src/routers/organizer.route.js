"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizerRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const organizer_controller_1 = __importDefault(require("../controllers/organizer.controller"));
const organizerRouter = () => { };
exports.organizerRouter = organizerRouter;
const router = express_1.default.Router();
router.get('/events', auth_middleware_1.verifyToken, organizer_controller_1.default.getEvents);
router.get('/events/:slug', auth_middleware_1.verifyToken, organizer_controller_1.default.getEventBySlug);
router.get('/events/:slug/attendees', auth_middleware_1.verifyToken, organizer_controller_1.default.getEventAttendees);
exports.default = router;
