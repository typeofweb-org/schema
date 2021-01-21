/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import type { Schema } from '../types';

import { TYPEOFWEB_SCHEMA, InitialModifiers } from './__schema';
import { typeToPrint, getModifiers, unionToPrint } from './__stringifyHelpers';
import { __validate } from './__validate';

export type STRING_VALIDATOR = typeof STRING_VALIDATOR;
export type StringSchema = ReturnType<typeof string>;
export const STRING_VALIDATOR = Symbol('string');
export const string = () => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: STRING_VALIDATOR,
    __modifiers: InitialModifiers,
    toString(shouldWrap) {
      return shouldWrap ? typeToPrint('string') : 'string';
    },
    __validate(_schema, value) {
      if (typeof value !== 'string') {
        return { _t: 'left', value: new ValidationError(this, value) };
      }
      if (
        typeof this.__modifiers.minLength === 'number' &&
        value.length < this.__modifiers.minLength
      ) {
        return { _t: 'left', value: new ValidationError(this, value) };
      }
      return { _t: 'right', value: value };
    },
  } as Schema<string, typeof InitialModifiers, never, STRING_VALIDATOR>;
};
