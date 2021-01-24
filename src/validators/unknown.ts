import { initialModifiers } from '../schema';
import { typeToPrint } from '../stringify';
import type { Schema } from '../types';

const modifiers = { ...initialModifiers, nullable: true, optional: true };
export const unknown = () => {
  return {
    __modifiers: modifiers,
    toString: toStringUnknown,
    __validate: validateUnknown,
  } as Schema<unknown, typeof modifiers, never>;
};

function toStringUnknown() {
  return typeToPrint('unknown');
}
function validateUnknown(this: Schema<unknown, typeof modifiers, never>, value: unknown) {
  return { _t: 'right', value };
}
