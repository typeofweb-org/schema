/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import type { Schema } from '../types';

import { TYPEOFWEB_SCHEMA, InitialModifiers } from './__schema';
import { typeToPrint } from './__stringifyHelpers';

export type BOOLEAN_VALIDATOR = typeof BOOLEAN_VALIDATOR;
export type BooleanSchema = ReturnType<typeof boolean>;
export const BOOLEAN_VALIDATOR = Symbol('boolean');
export const boolean = () => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: BOOLEAN_VALIDATOR,
    __modifiers: InitialModifiers,
    toString(shouldWrap) {
      return shouldWrap ? typeToPrint('boolean') : 'boolean';
    },
    __validate(schema, value) {
      if (typeof value !== 'boolean') {
        return { _t: 'left', value: new ValidationError(schema, value) };
      }
      return { _t: 'right', value };
    },
  } as Schema<boolean, typeof InitialModifiers, never, BOOLEAN_VALIDATOR>;
};
