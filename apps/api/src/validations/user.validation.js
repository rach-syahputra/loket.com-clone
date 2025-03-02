"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = exports.VerifyPasswordSchema = void 0;
const zod_1 = require("zod");
const MAX_IMAGE_SIZE = 1024000; //1MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
exports.VerifyPasswordSchema = zod_1.z.object({
    password: zod_1.z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must contain at least 6 characters')
        .max(20, 'Password should not exceed 20 characters')
});
exports.UpdateUserSchema = zod_1.z.object({
    password: zod_1.z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must contain at least 6 characters')
        .max(20, 'Password should not exceed 20 characters')
        .optional(),
    name: zod_1.z
        .string({ required_error: 'Name is required' })
        .min(3, 'Name must contain at least 3 characters')
        .max(30, 'Name should not exceed 40 characters')
        .optional(),
    image: zod_1.z
        .any()
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file === null || file === void 0 ? void 0 : file.mimetype), 'Image format is not supported')
        .refine((file) => (file === null || file === void 0 ? void 0 : file.size) <= MAX_IMAGE_SIZE, 'Max image size is 1MB')
        .optional()
});
