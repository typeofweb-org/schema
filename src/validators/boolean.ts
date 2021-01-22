/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import type { Schema } from '../types';

import { initialModifiers } from './__schema';
import { typeToPrint } from './__stringifyHelpers';

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
