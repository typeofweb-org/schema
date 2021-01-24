import { ValidationError } from '../errors';
import { initialModifiers } from '../schema';
import { typeToPrint } from '../stringify';
import type { Schema } from '../types';
import { isDate, isISODateString } from '../utils/dateUtils';

import { __validate } from './__validate';

export const date = () => {
  return {
    __modifiers: initialModifiers,
    toString: toStringDate,
    __parse: parseDate,
    __validate: validateDate,
  } as Schema<Date, typeof initialModifiers, never>;
};

function toStringDate() {
  return typeToPrint('Date');
}

function parseDate(this: Schema<Date, typeof initialModifiers, never>, value: unknown) {
  if (typeof value === 'string' && isISODateString(value)) {
    return new Date(value);
  }
  return value;
}

function validateDate(this: Schema<Date, typeof initialModifiers, never>, value: unknown) {
  if (!isDate(value) || Number.isNaN(Number(value))) {
    return { _t: 'left', value: new ValidationError(this, value) };
  }
  return { _t: 'right', value };
}
