"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nullable = exports.optional = void 0;
const optional = (schema) => {
    return Object.assign(Object.assign({}, schema), { __modifiers: Object.assign(Object.assign({}, schema.__modifiers), { optional: true }) });
};
exports.optional = optional;
const nullable = (schema) => {
    return Object.assign(Object.assign({}, schema), { __modifiers: Object.assign(Object.assign({}, schema.__modifiers), { nullable: true }) });
};
exports.nullable = nullable;
