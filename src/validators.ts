const LITERAL_VALIDATOR = Symbol('_literal');
const STRING_VALIDATOR = Symbol('string');
const NUMBER_VALIDATOR = Symbol('number');
const BOOLEAN_VALIDATOR = Symbol('boolean');
const DATE_VALIDATOR = Symbol('Date');
export type VALIDATORS =
  | typeof LITERAL_VALIDATOR
  | typeof STRING_VALIDATOR
  | typeof NUMBER_VALIDATOR
  | typeof BOOLEAN_VALIDATOR
  | typeof DATE_VALIDATOR
  | Record<keyof any, AnySchema>
  | readonly AnySchema[];

export interface ValidatorToType {
  readonly [STRING_VALIDATOR]: string;
  readonly [NUMBER_VALIDATOR]: number;
  readonly [DATE_VALIDATOR]: Date;
  readonly [BOOLEAN_VALIDATOR]: boolean;
}

import { ValidationError } from './errors';
import type { AnySchema, TypeOf, Schema } from './types';

const assertUnreachable = (val: never): never => {
  /* istanbul ignore next */
  throw new Error(val);
};

export const validate = <S extends AnySchema>(schema: S) => (value: unknown): TypeOf<S> => {
  if (value === undefined) {
    if (schema.__modifiers.optional) {
      return value as TypeOf<S>;
    } else {
      throw new ValidationError();
    }
  }

  if (value === null) {
    if (schema.__modifiers.nullable) {
      return value as TypeOf<S>;
    } else {
      throw new ValidationError();
    }
  }

  if (Array.isArray(schema.__validator)) {
    const validators = schema.__validator as readonly AnySchema[];
    if (!Array.isArray(value)) {
      throw new ValidationError();
    }
    return value.map((val: unknown) => {
      const validationResult = validators.reduce(
        (acc, validator) => {
          if (acc.isValid) {
            return acc;
          }
          try {
            const result: unknown = validate(validator)(val);
            return { isValid: true, result };
          } catch {}
          return { isValid: false, result: undefined };
        },
        { isValid: false, result: undefined as unknown },
      );
      if (validationResult.isValid) {
        return validationResult.result;
      }
      throw new ValidationError();
    }) as TypeOf<S>;
  }

  if (typeof schema.__validator === 'object') {
    const validators = schema.__validator as Record<keyof any, AnySchema>;
    if (typeof value !== 'object' || value === null) {
      throw new ValidationError();
    }

    const valueEntries = Object.entries(value);
    const validatorEntries = Object.entries(validators);
    if (valueEntries.length !== validatorEntries.length) {
      throw new ValidationError();
    }

    valueEntries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
    validatorEntries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

    return Object.fromEntries(
      valueEntries.map(([key, val], index) => [key, validate(validatorEntries[index]![1])(val)]),
    ) as TypeOf<S>;
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
    case BOOLEAN_VALIDATOR:
      if (typeof value !== 'boolean') {
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
  }

  /* istanbul ignore next */
  return assertUnreachable(schema.__validator);
};

// `U extends (keyof any)[]` and `[...U]` is a trick to force TypeScript to narrow the type correctly
// thanks to this, there's no need for "as const": oneOf(['a', 'b']) works as oneOf(['a', 'b'] as const)
export const oneOf = <U extends readonly (keyof any)[]>(values: readonly [...U]) => {
  return {
    __validator: LITERAL_VALIDATOR,
    __values: values,
    __type: {} as unknown,
    __modifiers: { optional: false, nullable: false },
  } as Schema<U[number], { readonly optional: false; readonly nullable: false }, U[number]>;
};

export const string = () => {
  return {
    __validator: STRING_VALIDATOR,
    __modifiers: { optional: false, nullable: false },
  } as Schema<string, { readonly optional: false; readonly nullable: false }, never>;
};

export const number = () => {
  return {
    __validator: NUMBER_VALIDATOR,
    __modifiers: { optional: false, nullable: false },
  } as Schema<number, { readonly optional: false; readonly nullable: false }, never>;
};

export const boolean = () => {
  return {
    __validator: BOOLEAN_VALIDATOR,
    __modifiers: { optional: false, nullable: false },
  } as Schema<boolean, { readonly optional: false; readonly nullable: false }, never>;
};

export const date = () => {
  return {
    __validator: DATE_VALIDATOR,
    __modifiers: { optional: false, nullable: false },
  } as Schema<Date, { readonly optional: false; readonly nullable: false }, never>;
};

export const object = <U extends Record<string, AnySchema>>(obj: U) => {
  return {
    __validator: obj,
    __type: {} as unknown,
    __modifiers: { optional: false, nullable: false },
    __values: {} as unknown,
  } as Schema<
    {
      readonly [K in keyof U]: TypeOf<U[K]>;
    },
    { readonly optional: false; readonly nullable: false },
    never
  >;
};

export const array = <U extends readonly AnySchema[]>(arr: readonly [...U]) => {
  return {
    __validator: arr,
    __type: {} as unknown,
    __modifiers: { optional: false, nullable: false },
    __values: {} as unknown,
  } as Schema<
    readonly TypeOf<U[number]>[],
    { readonly optional: false; readonly nullable: false },
    never
  >;
};
