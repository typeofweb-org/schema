/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import { initialModifiers } from '../schema';
import { typeToPrint } from '../stringify';
import type { Schema } from '../types';

export const number = () => {
  return {
    __modifiers: initialModifiers,
    toString() {
      return typeToPrint('number');
    },
    __parse(value) {
      if (typeof value === 'string') {
        if (value.trim() === '') {
          return value;
        }
        return Number(value);
      }
      return value;
    },
    __validate(_schema, value) {
      if (typeof value !== 'number' || Number.isNaN(value)) {
        return { _t: 'left', value: new ValidationError(this, value) };
      }
      return { _t: 'right', value };
    },
  } as Schema<number, typeof initialModifiers, never>;
};
