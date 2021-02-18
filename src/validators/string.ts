import { ValidationError } from '../errors';
import { typeToPrint } from '../stringify';
import type { Schema, SomeSchema } from '../types';
import { isDate } from '../utils/dateUtils';
import { left, right } from '../utils/either';

export const string = <S extends SomeSchema<unknown>>(schema?: S) => {
  return {
    toString: toStringString,
    __parse: parseString,
    __validate: validateString,
  } as Schema<string, never>;
};

function toStringString() {
  return typeToPrint('string');
}

function parseString(this: Schema<string, never>, value: unknown) {
  if (isDate(value)) {
    return value.toISOString();
  }
  return value;
}

function validateString(this: Schema<string, never>, value: unknown) {
  if (typeof value !== 'string') {
    return left(new ValidationError(this, value));
  }
  return right(value);
}
