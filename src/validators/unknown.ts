/* eslint-disable functional/no-this-expression */
import type { Schema } from '../types';

import { TYPEOFWEB_SCHEMA, InitialModifiers } from './__schema';
import { typeToPrint } from './__stringifyHelpers';

export type UNKNOWN_VALIDATOR = typeof UNKNOWN_VALIDATOR;
export type UnknownSchema = ReturnType<typeof unknown>;
export const UNKNOWN_VALIDATOR = Symbol('_unknown');
export const unknown = () => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: UNKNOWN_VALIDATOR,
    __modifiers: InitialModifiers,
    toString(plain) {
      return plain ? 'unknown' : typeToPrint('unknown');
    },
    __validate(_schema, value) {
      return { _t: 'right', value };
    },
  } as Schema<unknown, typeof InitialModifiers, never, UNKNOWN_VALIDATOR>;
};
