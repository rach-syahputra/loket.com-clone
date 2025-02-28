"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema, data) => {
    return schema.parse(data);
};
exports.validate = validate;
