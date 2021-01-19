import type {
  AnySchema,
  TypeOf,
  Schema,
  UndefinedToOptional,
  SomeSchema,
  DefaultModifiers,
} from './types';

export const TYPEOFWEB_SCHEMA = Symbol('@typeofweb/schema');
export const ONE_OF_VALIDATOR = Symbol('_literal');
export type ONE_OF_VALIDATOR = typeof ONE_OF_VALIDATOR;
export const TUPLE_VALIDATOR = Symbol('_tuple');
export type TUPLE_VALIDATOR = typeof TUPLE_VALIDATOR;
export const STRING_VALIDATOR = Symbol('string');
export type STRING_VALIDATOR = typeof STRING_VALIDATOR;
export const NUMBER_VALIDATOR = Symbol('number');
export type NUMBER_VALIDATOR = typeof NUMBER_VALIDATOR;
export const BOOLEAN_VALIDATOR = Symbol('boolean');
export type BOOLEAN_VALIDATOR = typeof BOOLEAN_VALIDATOR;
export const DATE_VALIDATOR = Symbol('Date');
export type DATE_VALIDATOR = typeof DATE_VALIDATOR;
export const UNKNOWN_VALIDATOR = Symbol('_unknown');
export type UNKNOWN_VALIDATOR = typeof UNKNOWN_VALIDATOR;

export const SIMPLE_VALIDATORS = [
  STRING_VALIDATOR,
  NUMBER_VALIDATOR,
  BOOLEAN_VALIDATOR,
  DATE_VALIDATOR,
  UNKNOWN_VALIDATOR,
] as const;

export type SIMPLE_VALIDATORS = typeof SIMPLE_VALIDATORS[number];
export type AllValidators =
  | ONE_OF_VALIDATOR
  | SIMPLE_VALIDATORS
  | TUPLE_VALIDATOR
  | Record<string, SomeSchema<any>>
  | readonly SomeSchema<any>[];

export interface SimpleValidatorToType {
  readonly [STRING_VALIDATOR]: string;
  readonly [NUMBER_VALIDATOR]: number;
  readonly [DATE_VALIDATOR]: Date;
  readonly [BOOLEAN_VALIDATOR]: boolean;
  readonly [UNKNOWN_VALIDATOR]: unknown;
}

export const isSimpleSchema = (s: SomeSchema<any>): s is SimpleSchema =>
  SIMPLE_VALIDATORS.includes(s.__validator);
export const isLiteralSchema = (s: SomeSchema<any>): s is OneOfSchema =>
  s.__validator === ONE_OF_VALIDATOR;
export const isTupleSchema = (s: SomeSchema<any>): s is TupleSchema =>
  s.__validator === TUPLE_VALIDATOR;
export const isArraySchema = (s: SomeSchema<any>): s is ArraySchema => Array.isArray(s.__validator);
export const isRecordSchema = (s: SomeSchema<any>): s is ObjectSchema =>
  !Array.isArray(s.__validator) && typeof s.__validator === 'object';

export const isOptionalSchema = (
  s: SomeSchema<any>,
): s is AnySchema & { readonly __modifiers: { readonly optional: true } } =>
  !!s.__modifiers.optional;

export const isSchema = (val: any): val is AnySchema => {
  return (
    typeof val === 'object' &&
    val !== null &&
    '__validator' in val &&
    '__modifiers' in val &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    val[TYPEOFWEB_SCHEMA] === true
  );
};

const InitialModifiers: DefaultModifiers = {
  optional: false,
  nullable: false,
  minLength: undefined,
};

// `U extends (keyof any)[]` and `[...U]` is a trick to force TypeScript to narrow the type correctly
// thanks to this, there's no need for "as const": oneOf(['a', 'b']) works as oneOf(['a', 'b'] as const)
export type OneOfSchema = ReturnType<typeof oneOf>;
export const oneOf = <U extends readonly (keyof any | boolean | SomeSchema<any>)[]>(
  values: readonly [...U],
) => {
  type X = {
    readonly [Index in keyof U]: U[Index] extends SomeSchema<any> ? TypeOf<U[Index]> : U[Index];
  }[number];

  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: ONE_OF_VALIDATOR,
    __values: values,
    __type: {} as unknown,
    __modifiers: InitialModifiers,
  } as Schema<X, typeof InitialModifiers, U, ONE_OF_VALIDATOR>;
};

export type StringSchema = ReturnType<typeof string>;
export const string = () => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: STRING_VALIDATOR,
    __modifiers: InitialModifiers,
  } as Schema<
    SimpleValidatorToType[STRING_VALIDATOR],
    typeof InitialModifiers,
    never,
    STRING_VALIDATOR
  >;
};

export type NumberSchema = ReturnType<typeof number>;
export const number = () => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: NUMBER_VALIDATOR,
    __modifiers: InitialModifiers,
  } as Schema<
    SimpleValidatorToType[NUMBER_VALIDATOR],
    typeof InitialModifiers,
    never,
    NUMBER_VALIDATOR
  >;
};

export type BooleanSchema = ReturnType<typeof boolean>;
export const boolean = () => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: BOOLEAN_VALIDATOR,
    __modifiers: InitialModifiers,
  } as Schema<
    SimpleValidatorToType[BOOLEAN_VALIDATOR],
    typeof InitialModifiers,
    never,
    BOOLEAN_VALIDATOR
  >;
};

export type DateSchema = ReturnType<typeof date>;
export const date = () => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: DATE_VALIDATOR,
    __modifiers: InitialModifiers,
  } as Schema<
    SimpleValidatorToType[DATE_VALIDATOR],
    typeof InitialModifiers,
    never,
    DATE_VALIDATOR
  >;
};

export type ObjectSchema = ReturnType<typeof object>;
export const object = <U extends Record<string, SomeSchema<any>>>(obj: U) => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: obj,
    __modifiers: InitialModifiers,
    __type: {} as unknown,
    __values: {} as unknown,
  } as Schema<
    UndefinedToOptional<
      {
        readonly [K in keyof U]: TypeOf<U[K]>;
      }
    >,
    typeof InitialModifiers,
    never,
    U
  >;
};

export type ArraySchema = ReturnType<typeof array>;
export const array = <U extends readonly SomeSchema<unknown>[]>(...arr: readonly [...U]) => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: arr,
    __modifiers: InitialModifiers,
    __type: {} as unknown,
    __values: {} as unknown,
  } as Schema<readonly TypeOf<U[number]>[], typeof InitialModifiers, never, U>;
};

export type UnknownSchema = ReturnType<typeof unknown>;
export const unknown = () => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: UNKNOWN_VALIDATOR,
    __modifiers: { optional: true, nullable: true, minLength: undefined },
  } as Schema<
    SimpleValidatorToType[UNKNOWN_VALIDATOR],
    { readonly optional: true; readonly nullable: true; readonly minLength: undefined },
    never,
    UNKNOWN_VALIDATOR
  >;
};

export type TupleSchema = ReturnType<typeof tuple>;
export const tuple = <U extends readonly (keyof any | boolean | SomeSchema<any>)[]>(
  values: readonly [...U],
) => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: TUPLE_VALIDATOR,
    __values: values,
    __type: {} as unknown,
    __modifiers: InitialModifiers,
  } as Schema<
    {
      readonly [Index in keyof U]: U[Index] extends SomeSchema<any> ? TypeOf<U[Index]> : U[Index];
    },
    typeof InitialModifiers,
    U,
    TUPLE_VALIDATOR
  >;
};

export type SimpleSchema = StringSchema | NumberSchema | BooleanSchema | DateSchema | UnknownSchema;
