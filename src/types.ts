import type { VALIDATORS } from './validators';

export type TypeOf<S extends AnySchema> = TypeOfModifiers<S> | TypeOfSchema<S>;

export interface Schema<Type extends unknown, Modifiers extends DefaultModifiers, Values> {
  readonly __type: Type;
  readonly __validator: VALIDATORS;
  readonly __values: readonly Values[];
  readonly __modifiers: Modifiers;
}

export type SomeSchema<T> = Schema<T, DefaultModifiers, any>;
export type AnySchema = SomeSchema<any>;

type DefaultModifiers<MinLength extends number = number> = {
  readonly optional?: boolean;
  readonly nullable?: boolean;
  readonly minLength?: MinLength;
};

type TupleOf<
  T,
  Length extends number,
  Acc extends readonly unknown[] = readonly []
> = Acc['length'] extends Length ? Acc : TupleOf<T, Length, readonly [T, ...Acc]>;

type TypeOfModifiers<S extends AnySchema> =
  | If<S['__modifiers'], { readonly optional: true }, undefined>
  | If<S['__modifiers'], { readonly nullable: true }, null>;

type TypeOfSchema<S extends AnySchema> = TypeOfValues<S> extends infer Result
  ? S['__modifiers'] extends { readonly minLength: infer L }
    ? L extends number
      ? IfIsArray<S, readonly [...TupleOf<TypeOfValues<S>[number], L>, ...TypeOfValues<S>], Result>
      : never
    : Result
  : never;

type TypeOfValues<S extends AnySchema> = S['__values'][number] extends never
  ? S['__type']
  : S['__values'][number];

type If<T, Condition, Y, N = never> = T extends Condition ? Y : N;
type IfIsArray<S extends AnySchema, Y, N = never> = If<S['__type'], readonly unknown[], Y, N>;
