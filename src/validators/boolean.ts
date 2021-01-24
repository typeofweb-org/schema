import { ValidationError } from '../errors';
import { initialModifiers } from '../schema';
import { typeToPrint } from '../stringify';
import type { Schema } from '../types';

export const boolean = () => {
  return {
    __modifiers: initialModifiers,
    toString: toStringBoolean,
    __validate: validateBoolean,
  } as Schema<boolean, typeof initialModifiers, never>;
};

function toStringBoolean() {
  return typeToPrint('boolean');
}

function validateBoolean(this: Schema<boolean, typeof initialModifiers, never>, value: unknown) {
  if (typeof value !== 'boolean') {
    return { _t: 'left', value: new ValidationError(this, value) };
  }
  return { _t: 'right', value };
}
