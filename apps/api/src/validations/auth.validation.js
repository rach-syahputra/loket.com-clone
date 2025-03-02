"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordSchema = exports.LoginSchema = exports.RegisterSchema = exports.RegisterRequestSchema = void 0;
const zod_1 = require("zod");
exports.RegisterRequestSchema = zod_1.z.object({
    email: zod_1.z.string().min(1, 'Email is required').email('Email format is invalid')
});
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, 'Email is required')
        .email('Email format is invalid'),
    password: zod_1.z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must contain at least 6 characters')
        .max(20, 'Password should not exceed 20 characters'),
    name: zod_1.z
        .string({ required_error: 'Name is required' })
        .min(3, 'Name must contain at least 3 characters')
        .max(30, 'Name should not exceed 40 characters'),
    referralCode: zod_1.z.string().optional().nullable()
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, 'Email is required')
        .email('Email format is invalid'),
    password: zod_1.z.string().min(1, 'Password is required')
});
exports.ResetPasswordSchema = zod_1.z.object({
    password: zod_1.z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must contain at least 6 characters')
        .max(20, 'Password should not exceed 20 characters')
});
