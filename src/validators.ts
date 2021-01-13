export const TYPEOFWEB_SCHEMA = Symbol('@typeofweb/schema');
export const LITERAL_VALIDATOR = Symbol('_literal');
export const STRING_VALIDATOR = Symbol('string');
export const NUMBER_VALIDATOR = Symbol('number');
export const BOOLEAN_VALIDATOR = Symbol('boolean');
export const DATE_VALIDATOR = Symbol('Date');
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

import type { AnySchema, TypeOf, Schema } from './types';

export const isSchema = (val: any): val is AnySchema => {
  return (
    typeof val === 'object' &&
    '__validator' in val &&
    '__modifiers' in val &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    val[TYPEOFWEB_SCHEMA] === true
  );
};

// `U extends (keyof any)[]` and `[...U]` is a trick to force TypeScript to narrow the type correctly
// thanks to this, there's no need for "as const": oneOf(['a', 'b']) works as oneOf(['a', 'b'] as const)
export const oneOf = <U extends readonly (keyof any | boolean | AnySchema)[]>(
  values: readonly [...U],
) => {
  type X = {
    readonly [Index in keyof U]: U[Index] extends AnySchema ? TypeOf<U[Index]> : U[Index];
  }[number];

  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: LITERAL_VALIDATOR,
    __values: values,
    __type: {} as unknown,
    __modifiers: { optional: false, nullable: false },
  } as Schema<X, { readonly optional: false; readonly nullable: false }, U[number]>;
};

export const string = () => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: STRING_VALIDATOR,
    __modifiers: { optional: false, nullable: false },
  } as Schema<string, { readonly optional: false; readonly nullable: false }, never>;
};

export const number = () => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: NUMBER_VALIDATOR,
    __modifiers: { optional: false, nullable: false },
  } as Schema<number, { readonly optional: false; readonly nullable: false }, never>;
};

export const boolean = () => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: BOOLEAN_VALIDATOR,
    __modifiers: { optional: false, nullable: false },
  } as Schema<boolean, { readonly optional: false; readonly nullable: false }, never>;
};

export const date = () => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: DATE_VALIDATOR,
    __modifiers: { optional: false, nullable: false },
  } as Schema<Date, { readonly optional: false; readonly nullable: false }, never>;
};

export const object = <U extends Record<string, AnySchema>>(obj: U) => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
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

export const array = <U extends readonly AnySchema[]>(...arr: readonly [...U]) => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
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
