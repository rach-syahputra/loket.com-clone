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
const search_service_1 = __importDefault(require("../services/search.service"));
class searchController {
    getSearchResults(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req.query;
                const result = yield search_service_1.default.searchEvents(query);
                res.status(200).send({
                    message: "Searching Query Successfully",
                    result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new searchController();
