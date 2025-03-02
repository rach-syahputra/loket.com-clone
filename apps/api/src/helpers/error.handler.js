"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseError = void 0;
class ResponseError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code || 500;
    }
}
exports.ResponseError = ResponseError;
