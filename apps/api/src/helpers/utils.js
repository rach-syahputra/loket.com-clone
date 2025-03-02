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
exports.calculateCouponsExpiryDate = calculateCouponsExpiryDate;
exports.generateHashedPassword = generateHashedPassword;
exports.convertToUTC7 = convertToUTC7;
exports.generateSlug = generateSlug;
exports.formatPrice = formatPrice;
exports.formatDateWithTime = formatDateWithTime;
exports.formatEventDate = formatEventDate;
exports.formatEventLocation = formatEventLocation;
exports.generateVerificationCode = generateVerificationCode;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
function calculateCouponsExpiryDate() {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 3); // Add 3 months to the current month
    return currentDate;
}
function generateHashedPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt();
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        return hashedPassword;
    });
}
function convertToUTC7(date) {
    return new Date(date.getTime() + 7 * 60 * 60 * 1000).toISOString();
}
function generateSlug(name) {
    const formattedName = name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
    const uniqueId = Date.now();
    return `${formattedName}-${uniqueId}`;
}
function formatPrice(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}
function formatDateWithTime(date) {
    const formatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    return new Intl.DateTimeFormat('en-GB', formatOptions)
        .format(date)
        .replace(',', '');
}
function formatEventDate(eventStartDate, eventEndDate, eventStartTime, eventEndTime) {
    const dateOptions = {
        day: '2-digit',
        month: 'short'
    };
    const yearOptions = { year: 'numeric' };
    const startDateStr = new Intl.DateTimeFormat('id-ID', dateOptions).format(eventStartDate);
    const endDateStr = new Intl.DateTimeFormat('id-ID', dateOptions).format(eventEndDate);
    const startYear = new Intl.DateTimeFormat('id-ID', yearOptions).format(eventStartDate);
    const endYear = new Intl.DateTimeFormat('id-ID', yearOptions).format(eventEndDate);
    // If the start and end dates are the same
    if (startDateStr === endDateStr && startYear === endYear) {
        return eventStartTime === eventEndTime
            ? `${startDateStr} ${startYear} ${eventStartTime}`
            : `${startDateStr} ${startYear} ${eventStartTime} - ${eventEndTime}`;
    }
    // If the start and end dates are different but within the same year
    if (startYear === endYear) {
        return eventStartTime === eventEndTime
            ? `${startDateStr} - ${endDateStr} ${startYear} ${eventStartTime}`
            : `${startDateStr} - ${endDateStr} ${startYear} ${eventStartTime} - ${eventEndTime}`;
    }
    return '';
}
function formatEventLocation(streetAddress, city, province) {
    return `${streetAddress}, ${city}, ${province}`;
}
function generateVerificationCode() {
    return crypto_1.default
        .randomBytes(8)
        .toString('base64')
        .replace(/[^A-Z]/g, '')
        .slice(0, 8);
}
