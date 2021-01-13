import type { VALIDATORS, ValidatorToType } from './validators';
import { NUMBER_VALIDATOR, DATE_VALIDATOR, STRING_VALIDATOR } from './validators';

const simplifiedISODateStringRegex = /^[+-]?\d{4}/;
export const isISODateString = (value: unknown) =>
  simplifiedISODateStringRegex.test(value as string)
    ? !Number.isNaN(Number(new Date(value as string)))
    : false;

export const parse = <V extends VALIDATORS>(validator: V) => (
  value: unknown,
): V extends keyof ValidatorToType ? ValidatorToType[V] : unknown => {
  switch (validator) {
    case NUMBER_VALIDATOR:
      if (typeof value === 'string') {
        if (value.trim() === '') {
          return value as V extends keyof ValidatorToType ? ValidatorToType[V] : unknown;
        }
        const parsedNumber = Number(value);
        return parsedNumber as V extends keyof ValidatorToType ? ValidatorToType[V] : unknown;
      }
      break;
    case DATE_VALIDATOR:
      if (typeof value === 'string') {
        if (isISODateString(value)) {
          const parsedDate = new Date(value);
          return parsedDate as V extends keyof ValidatorToType ? ValidatorToType[V] : unknown;
        }
        return value as V extends keyof ValidatorToType ? ValidatorToType[V] : unknown;
      }
      break;
    case STRING_VALIDATOR:
      if (Object.prototype.toString.call(value) === '[object Date]') {
        const parsedISOString = (value as Date).toISOString();
        return parsedISOString as V extends keyof ValidatorToType ? ValidatorToType[V] : unknown;
      }
      break;
  }
  return value as V extends keyof ValidatorToType ? ValidatorToType[V] : unknown;
};
