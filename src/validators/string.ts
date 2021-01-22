/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import type { Schema } from '../types';
import { isDate } from '../utils';

import { initialModifiers } from './__schema';
import { typeToPrint } from './__stringifyHelpers';
import { __validate } from './__validate';

export const string = () => {
  return {
    __modifiers: initialModifiers,
    toString() {
      return typeToPrint('string');
    },
    __parse(value) {
      if (isDate(value)) {
        return value.toISOString();
      }
      return value;
    },
    __validate(_schema, value) {
      if (typeof value !== 'string') {
        return { _t: 'left', value: new ValidationError(this, value) };
      }
      return { _t: 'right', value: value };
    },
  } as Schema<string, typeof initialModifiers, never>;
};
