/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import type { Schema } from '../types';
import { TYPEOFWEB_SCHEMA, InitialModifiers, NUMBER_VALIDATOR } from '../validators';

import { __validate } from './__validate';

export type NumberSchema = ReturnType<typeof number>;
export const number = () => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: NUMBER_VALIDATOR,
    __modifiers: InitialModifiers,
    __validate(_schema, value) {
      if (typeof value !== 'number' || Number.isNaN(value)) {
        return { _t: 'left', value: new ValidationError(this, value) };
      }
      return { _t: 'right', value };
    },
  } as Schema<number, typeof InitialModifiers, never, NUMBER_VALIDATOR>;
};
