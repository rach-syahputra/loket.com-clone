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
exports.sendRegisterVerificationEmail = exports.sendPasswordResetEmail = exports.sendPaymentEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const config_1 = require("../../config");
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: config_1.NODEMAILER_USER,
        pass: config_1.NODEMAILER_PASS
    }
});
const sendPaymentEmail = (to, status, bodyData) => __awaiter(void 0, void 0, void 0, function* () {
    const templatePath = status === 'DONE'
        ? path_1.default.join(__dirname, 'email-accepted-payment-template.hbs')
        : path_1.default.join(__dirname, 'email-rejected-payment-template.hbs');
    const templateSource = fs_1.default.readFileSync(templatePath, 'utf8');
    const template = handlebars_1.default.compile(templateSource);
    const subject = status === 'DONE'
        ? `[${bodyData.transactionId}] E-Voucher for ${bodyData.eventTitle}`
        : `Payment rejected`;
    const html = template(bodyData);
    try {
        yield transporter.sendMail({
            from: 'Mini Loket',
            to,
            subject,
            html
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.sendPaymentEmail = sendPaymentEmail;
const sendPasswordResetEmail = (to, bodyData) => __awaiter(void 0, void 0, void 0, function* () {
    const templatePath = path_1.default.join(__dirname, 'email-password-reset-template.hbs');
    const templateSource = fs_1.default.readFileSync(templatePath, 'utf8');
    const template = handlebars_1.default.compile(templateSource);
    const subject = 'Reset Kata Sandi';
    const html = template(bodyData);
    try {
        yield transporter.sendMail({
            from: 'Mini Loket',
            to,
            subject,
            html
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const sendRegisterVerificationEmail = (to, bodyData) => __awaiter(void 0, void 0, void 0, function* () {
    const templatePath = path_1.default.join(__dirname, 'email-register-verification-template.hbs');
    const templateSource = fs_1.default.readFileSync(templatePath, 'utf8');
    const template = handlebars_1.default.compile(templateSource);
    const subject = 'Permintaan Pendaftaran ke Mini Loket';
    const html = template(bodyData);
    try {
        yield transporter.sendMail({
            from: 'Mini Loket',
            to,
            subject,
            html
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.sendRegisterVerificationEmail = sendRegisterVerificationEmail;
