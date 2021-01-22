/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import { initialModifiers } from '../schema';
import { typeToPrint } from '../stringify';
import type { Schema } from '../types';

export const boolean = () => {
  return {
    __modifiers: initialModifiers,
    toString() {
      return typeToPrint('boolean');
    },
    __validate(schema, value) {
      if (typeof value !== 'boolean') {
        return { _t: 'left', value: new ValidationError(schema, value) };
      }
      return { _t: 'right', value };
    },
  } as Schema<boolean, typeof initialModifiers, never>;
};
