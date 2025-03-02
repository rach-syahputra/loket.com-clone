"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEventBySlugSchema = void 0;
const zod_1 = require("zod");
exports.GetEventBySlugSchema = zod_1.z.object({
    organizerId: zod_1.z.number({ required_error: 'Organizer ID is required' }),
    slug: zod_1.z.string({ required_error: 'Slug is required' })
});
