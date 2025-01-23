"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
        this.routes();
        this.handleError();
    }
    routes() {
        this.app.get('/', (req, res, next) => {
            res.status(200).send({
                message: 'Welcome to loket.com API'
            });
        });
    }
    configure() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
    }
    handleError() {
        //not found handler
        this.app.use((req, res, next) => {
            res.status(404).send('Not found !');
        });
        //error handler
        this.app.use((err, req, res, next) => {
            res.status(err.code || 500).send({
                message: err.message
            });
        });
    }
    start() {
        this.app.listen(config_1.PORT, () => {
            console.log('Loket.com API is running on PORT', config_1.PORT);
        });
    }
}
exports.App = App;
