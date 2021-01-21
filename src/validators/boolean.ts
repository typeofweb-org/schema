/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import type { Schema } from '../types';
import { TYPEOFWEB_SCHEMA, InitialModifiers, BOOLEAN_VALIDATOR } from '../validators';

import { __validate } from './__validate';

export type BooleanSchema = ReturnType<typeof boolean>;
export const boolean = () => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: BOOLEAN_VALIDATOR,
    __modifiers: InitialModifiers,
    __validate(schema, value) {
      if (typeof value !== 'boolean') {
        return { _t: 'left', value: new ValidationError(schema, value) };
      }
      return { _t: 'right', value };
    },
  } as Schema<boolean, typeof InitialModifiers, never, BOOLEAN_VALIDATOR>;
};
