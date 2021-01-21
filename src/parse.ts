import { isDate } from './utils';
import type { AllValidators, SimpleValidatorToType } from './validationHelpers';
import { DATE_VALIDATOR } from './validators/date';
import { NUMBER_VALIDATOR } from './validators/number';
import { STRING_VALIDATOR } from './validators/string';

const simplifiedISODateStringRegex = /^[+-]?\d{4}/;
export const isISODateString = (value: unknown) =>
  simplifiedISODateStringRegex.test(value as string);

export const parse = <V extends AllValidators>(validator: V) => (
  value: unknown,
): V extends keyof SimpleValidatorToType ? SimpleValidatorToType[V] : unknown => {
  switch (validator) {
    case NUMBER_VALIDATOR:
      if (typeof value === 'string') {
        if (value.trim() === '') {
          return value as V extends keyof SimpleValidatorToType
            ? SimpleValidatorToType[V]
            : unknown;
        }
        const parsedNumber = Number(value);
        return parsedNumber as V extends keyof SimpleValidatorToType
          ? SimpleValidatorToType[V]
          : unknown;
      }
      break;
    case DATE_VALIDATOR:
      if (typeof value === 'string') {
        if (isISODateString(value)) {
          const parsedDate = new Date(value);
          return parsedDate as V extends keyof SimpleValidatorToType
            ? SimpleValidatorToType[V]
            : unknown;
        }
        return value as V extends keyof SimpleValidatorToType ? SimpleValidatorToType[V] : unknown;
      }
      break;
    case STRING_VALIDATOR:
      if (isDate(value)) {
        const parsedISOString = value.toISOString();
        return parsedISOString as V extends keyof SimpleValidatorToType
          ? SimpleValidatorToType[V]
          : unknown;
      }
      break;
  }
  return value as V extends keyof SimpleValidatorToType ? SimpleValidatorToType[V] : unknown;
};
