import { ValidationError } from '../errors';
import { typeToPrint } from '../stringify';
import type { Schema, SomeSchema } from '../types';
import { isDate, isISODateString } from '../utils/dateUtils';
import { left, right } from '../utils/either';

export const date = <S extends SomeSchema<unknown>>(schema?: S) => {
  return {
    toString: toStringDate,
    __parse: parseDate,
    __validate: validateDate,
  } as Schema<Date, never>;
};

function toStringDate() {
  return typeToPrint('Date');
}

function parseDate(this: Schema<Date, never>, value: unknown) {
  if (typeof value === 'string' && isISODateString(value)) {
    return new Date(value);
  }
  return value;
}

function validateDate(this: Schema<Date, never>, value: unknown) {
  if (!isDate(value) || Number.isNaN(Number(value))) {
    return left(new ValidationError(this, value));
  }
  return right(value);
}
