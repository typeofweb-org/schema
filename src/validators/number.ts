/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import type { Schema } from '../types';

import { TYPEOFWEB_SCHEMA, InitialModifiers } from './__schema';
import { typeToPrint } from './__stringifyHelpers';

export type NUMBER_VALIDATOR = typeof NUMBER_VALIDATOR;
export type NumberSchema = ReturnType<typeof number>;
export const NUMBER_VALIDATOR = Symbol('number');
export const number = () => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: NUMBER_VALIDATOR,
    __modifiers: InitialModifiers,
    toString(plain) {
      return plain ? 'number' : typeToPrint('number');
    },
    __validate(_schema, value) {
      if (typeof value !== 'number' || Number.isNaN(value)) {
        return { _t: 'left', value: new ValidationError(this, value) };
      }
      return { _t: 'right', value };
    },
  } as Schema<number, typeof InitialModifiers, never, NUMBER_VALIDATOR>;
};
