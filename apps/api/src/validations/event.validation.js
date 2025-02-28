"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEventSchema = void 0;
const zod_1 = require("zod");
const MAX_IMAGE_SIZE = 2048000; //2MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
exports.UpdateEventSchema = zod_1.z.object({
    eventId: zod_1.z.number({ required_error: 'event id is required' }),
    organizerId: zod_1.z.number({ required_error: 'organizer id is required' }),
    title: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    banner: zod_1.z
        .any()
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file === null || file === void 0 ? void 0 : file.mimetype), 'Image format is not supported')
        .refine((file) => (file === null || file === void 0 ? void 0 : file.size) <= MAX_IMAGE_SIZE, 'Max image size is 2MB')
        .optional(),
    registrationStartDate: zod_1.z.date().optional(),
    registrationEndDate: zod_1.z.date().optional(),
    eventStartDate: zod_1.z.date().optional(),
    eventEndDate: zod_1.z.date().optional(),
    eventStartTime: zod_1.z.string().optional(),
    eventEndTime: zod_1.z.string().optional(),
    price: zod_1.z.number().optional(),
    availableSeats: zod_1.z.number().optional(),
    locationId: zod_1.z.number().optional(),
    provinceId: zod_1.z.number().optional(),
    streetAddress: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    categoryId: zod_1.z.number().optional(),
    ticketType: zod_1.z.enum(['FREE', 'PAID']).optional()
});
