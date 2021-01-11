const LITERAL_VALIDATOR = Symbol('_literal');
const STRING_VALIDATOR = Symbol('string');
const NUMBER_VALIDATOR = Symbol('number');
const DATE_VALIDATOR = Symbol('Date');
export type VALIDATORS =
  | typeof LITERAL_VALIDATOR
  | typeof STRING_VALIDATOR
  | typeof NUMBER_VALIDATOR
  | typeof DATE_VALIDATOR;

export interface ValidatorToType {
  [STRING_VALIDATOR]: string;
  [NUMBER_VALIDATOR]: number;
  [DATE_VALIDATOR]: Date;
}

import { ValidationError } from './errors';
import type { AnySchema, TypeOf, Schema } from './types';

export const assert = <S extends AnySchema>(schema: S) => (value: unknown): TypeOf<S> => {
  if (value === undefined && schema.__modifiers.optional) {
    return value as TypeOf<S>;
  }
  if (value === null && schema.__modifiers.nullable) {
    return value as TypeOf<S>;
  }
  if (schema.__values && schema.__values.includes(value)) {
    return value as TypeOf<S>;
  }

  switch (schema.__type) {
    case STRING_VALIDATOR:
      if (typeof value !== 'string') {
        throw new ValidationError();
      }
      return value as TypeOf<S>;
    case NUMBER_VALIDATOR:
      if (typeof value !== 'number') {
        throw new ValidationError();
      }
      return value as TypeOf<S>;
    case DATE_VALIDATOR:
  }

  throw new ValidationError();
};

export const oneOf = <U extends readonly unknown[]>(values: U) => {
  return {
    __validator: LITERAL_VALIDATOR,
    __values: values,
    __type: {},
    __modifiers: { optional: false, nullable: false },
  } as Schema<U[number], { optional: false; nullable: false }, U[number]>;
};

export const string = () => {
  return {
    __validator: STRING_VALIDATOR,
  } as Schema<string, { optional: false; nullable: false }, never>;
};

export const number = () => {
  return {
    __validator: NUMBER_VALIDATOR,
  } as Schema<number, { optional: false; nullable: false }, never>;
};

export const date = () => {
  return {
    __validator: DATE_VALIDATOR,
  } as Schema<Date, { optional: false; nullable: false }, never>;
};
