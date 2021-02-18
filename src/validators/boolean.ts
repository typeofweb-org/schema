import { ValidationError } from '../errors';
import { typeToPrint } from '../stringify';
import type { Schema, SomeSchema } from '../types';
import { left, right } from '../utils/either';

export const boolean = <S extends SomeSchema<unknown>>(schema?: S) => {
  return {
    toString: toStringBoolean,
    __validate: validateBoolean,
  } as Schema<boolean, never>;
};

function toStringBoolean() {
  return typeToPrint('boolean');
}

function validateBoolean(this: Schema<boolean, never>, value: unknown) {
  if (typeof value !== 'boolean') {
    return left(new ValidationError(this, value));
  }
  return right(value);
}
