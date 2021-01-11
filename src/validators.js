"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.date = exports.number = exports.string = exports.oneOf = exports.assert = void 0;
const LITERAL_VALIDATOR = Symbol('_literal');
const STRING_VALIDATOR = Symbol('string');
const NUMBER_VALIDATOR = Symbol('number');
const DATE_VALIDATOR = Symbol('Date');
const errors_1 = require("./errors");
const assert = (schema) => (value) => {
    if (value === undefined && schema.__modifiers.optional) {
        return value;
    }
    if (value === null && schema.__modifiers.nullable) {
        return value;
    }
    if (schema.__values && schema.__values.includes(value)) {
        return value;
    }
    switch (schema.__type) {
        case STRING_VALIDATOR:
            if (typeof value !== 'string') {
                throw new errors_1.ValidationError();
            }
            return value;
        case NUMBER_VALIDATOR:
            if (typeof value !== 'number') {
                throw new errors_1.ValidationError();
            }
            return value;
        case DATE_VALIDATOR:
    }
    throw new errors_1.ValidationError();
};
exports.assert = assert;
const oneOf = (values) => {
    return {
        __validator: LITERAL_VALIDATOR,
        __values: values,
        __type: {},
        __modifiers: { optional: false, nullable: false },
    };
};
exports.oneOf = oneOf;
const string = () => {
    return {
        __validator: STRING_VALIDATOR,
    };
};
exports.string = string;
const number = () => {
    return {
        __validator: NUMBER_VALIDATOR,
    };
};
exports.number = number;
const date = () => {
    return {
        __validator: DATE_VALIDATOR,
    };
};
exports.date = date;
