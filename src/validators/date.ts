/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import type { Schema } from '../types';
import { isDate } from '../utils';
import { TYPEOFWEB_SCHEMA, InitialModifiers, DATE_VALIDATOR } from '../validators';

import { __validate } from './__validate';

export type DateSchema = ReturnType<typeof date>;
export const date = () => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: DATE_VALIDATOR,
    __modifiers: InitialModifiers,
    __validate(schema, value) {
      if (!isDate(value) || Number.isNaN(Number(value))) {
        return { _t: 'left', value: new ValidationError(schema, value) };
      }
      return { _t: 'right', value };
    },
  } as Schema<Date, typeof InitialModifiers, never, DATE_VALIDATOR>;
};
