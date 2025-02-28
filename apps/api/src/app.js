"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const config_1 = require("./config");
const error_handler_1 = require("./helpers/error.handler");
const api_route_1 = __importDefault(require("./routers/api.route"));
const scheduler_1 = require("./helpers/scheduler");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
        this.routes();
        this.handleError();
        this.scheduler();
    }
    scheduler() {
        (0, scheduler_1.couponExpirationScheduler)();
    }
    configure() {
        this.app.use((0, cors_1.default)(config_1.corsOptions));
        this.app.options('*', (req, res) => {
            res.header('Access-Control-Allow-Origin', 'https://mini-loket.vercel.app');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.header('Access-Control-Allow-Credentials', 'true');
            res.sendStatus(204);
        });
        this.app.use(express_1.default.json());
    }
    routes() {
        this.app.use('/api', api_route_1.default);
    }
    handleError() {
        //not found handler
        this.app.use((req, res, next) => {
            res.status(404).json({
                message: 'Not Found.'
            });
        });
        //error handler
        this.app.use((err, req, res, next) => {
            if (!err) {
                next();
                return;
            }
            if (err instanceof error_handler_1.ResponseError) {
                res.status(err.code || 500).json({
                    success: false,
                    error: {
                        message: err.message
                    }
                });
            }
            else if (err instanceof zod_1.ZodError) {
                res.status(400).json({
                    success: false,
                    error: err.issues[0]
                });
            }
            else if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'jwt is expired'
                    }
                });
            }
            else {
                console.log(err.message);
                res.status(500).json({
                    success: false,
                    error: {
                        message: 'Something went wrong, please try again later',
                        originalMessage: err.message
                    }
                });
            }
        });
    }
    start() {
        this.app.listen(config_1.PORT, () => {
            console.log('Loket.com API is running on PORT', config_1.PORT);
        });
    }
}
exports.App = App;
