/* eslint-disable functional/no-this-expression */
import { initialModifiers } from '../schema';
import { typeToPrint } from '../stringify';
import type { Schema } from '../types';

const modifiers = { ...initialModifiers, nullable: true, optional: true };
export const unknown = () => {
  return {
    __modifiers: modifiers,
    toString() {
      return typeToPrint('unknown');
    },
    __validate(_schema, value) {
      return { _t: 'right', value };
    },
  } as Schema<unknown, typeof modifiers, never>;
};
