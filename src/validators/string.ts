import { ValidationError } from '../errors';
import { initialModifiers } from '../schema';
import { typeToPrint } from '../stringify';
import type { Schema } from '../types';
import { isDate } from '../utils/dateUtils';

import { __validate } from './__validate';

export const string = () => {
  return {
    __modifiers: initialModifiers,
    toString: toStringString,
    __parse: parseString,
    __validate: validateString,
  } as Schema<string, typeof initialModifiers, never>;
};

function toStringString() {
  return typeToPrint('string');
}

function parseString(this: Schema<string, typeof initialModifiers, never>, value: unknown) {
  if (isDate(value)) {
    return value.toISOString();
  }
  return value;
}

function validateString(this: Schema<string, typeof initialModifiers, never>, value: unknown) {
  if (typeof value !== 'string') {
    return { _t: 'left', value: new ValidationError(this, value) };
  }
  return { _t: 'right', value: value };
}
