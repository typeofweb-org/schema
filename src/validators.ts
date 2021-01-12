const LITERAL_VALIDATOR = Symbol('_literal');
const STRING_VALIDATOR = Symbol('string');
const NUMBER_VALIDATOR = Symbol('number');
const DATE_VALIDATOR = Symbol('Date');
const OBJECT_VALIDATOR = Symbol('object');
export type VALIDATORS =
  | typeof LITERAL_VALIDATOR
  | typeof STRING_VALIDATOR
  | typeof NUMBER_VALIDATOR
  | typeof DATE_VALIDATOR
  | typeof OBJECT_VALIDATOR;

export interface ValidatorToType {
  readonly [STRING_VALIDATOR]: string;
  readonly [NUMBER_VALIDATOR]: number;
  readonly [DATE_VALIDATOR]: Date;
}

import { ValidationError } from './errors';
import type { AnySchema, TypeOf, Schema } from './types';

const assertUnreachable = (val: never): never => {
  throw new Error(val);
};

export const validate = <S extends AnySchema>(schema: S) => (value: unknown): TypeOf<S> => {
  if (value === undefined && schema.__modifiers.optional) {
    return value as TypeOf<S>;
  }
  if (value === null && schema.__modifiers.nullable) {
    return value as TypeOf<S>;
  }
  if (schema.__values && schema.__values.includes(value)) {
    return value as TypeOf<S>;
  }

  switch (schema.__validator) {
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
      if (Object.prototype.toString.call(value) !== '[object Date]') {
        throw new ValidationError();
      }
      return value as TypeOf<S>;
    case LITERAL_VALIDATOR:
      if (!schema.__values?.includes(value)) {
        throw new ValidationError();
      }
      return value as TypeOf<S>;
    case OBJECT_VALIDATOR:
      if (typeof schema.__type === 'object') {
        // @todo
        throw new ValidationError();
      }
      return value as TypeOf<S>;
  }
  return assertUnreachable(schema.__validator);
};

export const oneOf = <U extends readonly unknown[]>(values: U) => {
  return {
    __validator: LITERAL_VALIDATOR,
    __values: values,
    __type: {},
    __modifiers: { optional: false, nullable: false },
  } as Schema<U[number], { readonly optional: false; readonly nullable: false }, U[number]>;
};

export const string = () => {
  return {
    __validator: STRING_VALIDATOR,
  } as Schema<string, { readonly optional: false; readonly nullable: false }, never>;
};

export const number = () => {
  return {
    __validator: NUMBER_VALIDATOR,
  } as Schema<number, { readonly optional: false; readonly nullable: false }, never>;
};

export const date = () => {
  return {
    __validator: DATE_VALIDATOR,
  } as Schema<Date, { readonly optional: false; readonly nullable: false }, never>;
};

export const object = <U extends Record<string, AnySchema>>(obj: U) => {
  return {
    __validator: OBJECT_VALIDATOR,
    __type: obj as unknown,
  } as Schema<
    {
      readonly [K in keyof U]: TypeOf<U[K]>;
    },
    { readonly optional: false; readonly nullable: false },
    never
  >;
};
