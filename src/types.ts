import type {
  TYPEOFWEB_SCHEMA,
  AllValidators,
  ArraySchema,
  TupleSchema,
  SimpleSchema,
  OneOfSchema,
  ObjectSchema,
} from './validators';

export type TypeOf<S extends SomeSchema<any>> = TypeOfModifiers<S> | TypeOfSchema<S>;

export type Primitives = keyof any | boolean;
export type Json = Primitives | { readonly [prop in string | number]: Json } | readonly Json[];
export interface Schema<
  Type extends unknown,
  Modifiers extends DefaultModifiers,
  Values extends DefaultValues,
  Validator extends AllValidators = AllValidators
> {
  readonly [TYPEOFWEB_SCHEMA]: true;
  readonly __type: Type;
  readonly __validator: Validator;
  readonly __values: Values;
  readonly __modifiers: Modifiers;
}

export type SomeSchema<T> = Schema<T, DefaultModifiers, DefaultValues, AllValidators>;
export type AnySchema = SimpleSchema | OneOfSchema | TupleSchema | ArraySchema | ObjectSchema;

export type DefaultModifiers<MinLength extends number = number> = {
  readonly optional: boolean;
  readonly nullable: boolean;
  readonly minLength?: MinLength;
};

type DefaultValues = SomeSchema<any> | Primitives | readonly (SomeSchema<any> | Primitives)[];

export type TupleOf<
  T,
  Length extends number,
  Acc extends readonly unknown[] = readonly []
> = Acc['length'] extends Length ? Acc : TupleOf<T, Length, readonly [T, ...Acc]>;

type TypeOfModifiers<S extends SomeSchema<any>> =
  | If<S['__modifiers'], { readonly optional: true }, undefined>
  | If<S['__modifiers'], { readonly nullable: true }, null>;

type TypeOfSchema<S extends SomeSchema<any>> = S extends SomeSchema<infer R> ? R : never;

type If<T, Condition, Y, N = never> = T extends Condition ? Y : N;

export type Pretty<X extends object> = {
  readonly [K in keyof X]: X[K];
};

type KeysOfType<T extends object, SelectedType> = {
  readonly [key in keyof T]: SelectedType extends T[key] ? key : never;
}[keyof T];

type PlainObject = { readonly [name: string]: any };
type Optional<T extends object> = Partial<Pick<T, KeysOfType<T, undefined>>>;
type Required<T extends object> = Omit<T, KeysOfType<T, undefined>>;

export type UndefinedToOptional<T> = T extends PlainObject
  ? {} extends T
    ? {}
    : T extends Date | readonly unknown[]
    ? T
    : Pretty<Required<T> & Optional<T>>
  : T;
