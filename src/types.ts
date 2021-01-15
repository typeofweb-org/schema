import type {
  SimpleValidatorToType,
  TYPEOFWEB_SCHEMA,
  AllValidators,
  SimpleValidators,
  LiteralValidator,
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
  readonly __values: readonly Values[];
  readonly __modifiers: Modifiers;
}

export type SimpleSchema = Schema<
  SimpleValidatorToType[SimpleValidators],
  DefaultModifiers,
  DefaultValues,
  SimpleValidators
>;
export type LiteralSchema = Schema<unknown, DefaultModifiers, DefaultValues, LiteralValidator>;
export type ArraySchema = Schema<
  readonly unknown[],
  DefaultModifiers,
  DefaultValues,
  readonly AnySchema[]
>;
export type RecordSchema = Schema<
  Record<string, unknown>,
  DefaultModifiers,
  DefaultValues,
  Record<string, AnySchema>
>;
export type SomeSchema<T> = Schema<T, DefaultModifiers, DefaultValues, AllValidators>;
export type AnySchema = SimpleSchema | LiteralSchema | ArraySchema | RecordSchema;

type DefaultModifiers<MinLength extends number = number> = {
  readonly optional?: boolean;
  readonly nullable?: boolean;
  readonly minLength?: MinLength;
};

type DefaultValues = SomeSchema<any> | Primitives;

type TupleOf<
  T,
  Length extends number,
  Acc extends readonly unknown[] = readonly []
> = Acc['length'] extends Length ? Acc : TupleOf<T, Length, readonly [T, ...Acc]>;

type TypeOfModifiers<S extends SomeSchema<any>> =
  | If<S['__modifiers'], { readonly optional: true }, undefined>
  | If<S['__modifiers'], { readonly nullable: true }, null>;

type TypeOfSchema<S extends SomeSchema<any>> = TypeOfValues<S> extends infer Result
  ? S['__modifiers'] extends { readonly minLength: infer L }
    ? L extends number
      ? IfIsArray<S, readonly [...TupleOf<TypeOfValues<S>[number], L>, ...TypeOfValues<S>], Result>
      : never
    : Result
  : never;

type TypeOfValue<Value> = Value extends SomeSchema<infer R> ? R : Value;

type TypeOfValues<S extends SomeSchema<any>> = S['__values'][number] extends never
  ? S['__type']
  : TypeOfValue<S['__values'][number]>;

type If<T, Condition, Y, N = never> = T extends Condition ? Y : N;
type IfIsArray<S extends SomeSchema<any>, Y, N = never> = If<S['__type'], readonly unknown[], Y, N>;
