import { ValidationError } from '../errors';
import { typeToPrint } from '../stringify';
import type { Schema } from '../types';
import { left, right } from '../utils/either';

export const number = () => {
  return {
    toString: toStringNumber,
    __parse: parseNumber,
    __validate: validateNumber,
  } as Schema<number, never>;
};

function toStringNumber() {
  return typeToPrint('number');
}

function parseNumber(this: Schema<number, never>, value: unknown) {
  if (typeof value === 'string') {
    if (value.trim() === '') {
      return value;
    }
    return Number(value);
  }
  return value;
}

function validateNumber(this: Schema<number, never>, value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return left(new ValidationError(this, value));
  }
  return right(value);
}
