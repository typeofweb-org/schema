import { ValidationError } from '../errors';
import { initialModifiers } from '../schema';
import { typeToPrint } from '../stringify';
import type { Schema } from '../types';

export const number = () => {
  return {
    __modifiers: initialModifiers,
    toString: toStringNumber,
    __parse: parseNumber,
    __validate: validateNumber,
  } as Schema<number, typeof initialModifiers, never>;
};

function toStringNumber() {
  return typeToPrint('number');
}

function parseNumber(this: Schema<number, typeof initialModifiers, never>, value: unknown) {
  if (typeof value === 'string') {
    if (value.trim() === '') {
      return value;
    }
    return Number(value);
  }
  return value;
}

function validateNumber(this: Schema<number, typeof initialModifiers, never>, value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return { _t: 'left', value: new ValidationError(this, value) };
  }
  return { _t: 'right', value };
}
