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
exports.putAccessToken = putAccessToken;
exports.putRefreshToken = putRefreshToken;
exports.putAccessTokenForPasswordReset = putAccessTokenForPasswordReset;
exports.putAccessTokenForRegistration = putAccessTokenForRegistration;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
function putAccessToken(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign(data, config_1.JWT_ACCESS_SECRET, {
            expiresIn: '1d'
        });
    });
}
function putRefreshToken(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign(data, config_1.JWT_REFRESH_SECRET, {
            expiresIn: '1d'
        });
    });
}
function putAccessTokenForPasswordReset(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign({ email: email }, config_1.JWT_ACCESS_SECRET, {
            expiresIn: '5m'
        });
    });
}
function putAccessTokenForRegistration(email) {
    return __awaiter(this, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign({ email }, config_1.JWT_ACCESS_SECRET, {
            expiresIn: '10m'
        });
    });
}
