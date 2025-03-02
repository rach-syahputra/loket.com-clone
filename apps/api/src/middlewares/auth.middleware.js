"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const error_handler_1 = require("../helpers/error.handler");
function verifyToken(req, res, next) {
    try {
        const { authorization } = req.headers;
        const token = String(authorization || '').split('Bearer ')[1];
        if (!token)
            throw new error_handler_1.ResponseError(401, 'Unauthorized.');
        const verifiedUser = jsonwebtoken_1.default.verify(token, config_1.JWT_ACCESS_SECRET);
        if (!verifiedUser)
            throw new error_handler_1.ResponseError(401, 'Unauthorized.');
        req.user = verifiedUser;
        next();
    }
    catch (err) {
        next(err);
    }
}
