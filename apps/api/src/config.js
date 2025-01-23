"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.NODE_ENV = void 0;
const dotenv_1 = require("dotenv");
const path_1 = require("path");
exports.NODE_ENV = process.env.NODE_ENV || 'development';
const envFile = exports.NODE_ENV === 'development' ? '.env.local' : '.env';
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, `../${envFile}`), override: true });
exports.PORT = process.env.PORT || 8000;
