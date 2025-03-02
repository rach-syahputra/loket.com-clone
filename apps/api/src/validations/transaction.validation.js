"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTransactionSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const MAX_IMAGE_SIZE = 1024000; //1MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
exports.UpdateTransactionSchema = zod_1.z.object({
    transactionId: zod_1.z.number({ required_error: 'Transaction ID is required' }),
    organizerId: zod_1.z.number({ required_error: 'Organizer ID is required' }),
    paymentProofImage: zod_1.z
        .any()
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file === null || file === void 0 ? void 0 : file.mimetype), 'Image format is not supported')
        .refine((file) => (file === null || file === void 0 ? void 0 : file.size) <= MAX_IMAGE_SIZE, 'Max image size is 1MB')
        .optional(),
    transactionStatus: zod_1.z
        .enum(Object.values(client_1.TransactionStatus))
        .optional()
});
