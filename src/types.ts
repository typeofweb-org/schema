import type { ValidationError } from './errors';
import type { Next } from './utils/either';

export type TypeOf<S extends SomeSchema<any>> = Pretty<TypeOfSchema<S>>;

export type Primitives = string | number | boolean;
export type Json = Primitives | { readonly [prop in string | number]: Json } | readonly Json[];
export interface Schema<Type extends unknown, Values extends DefaultValues, Modifiers = never> {
  readonly __type: Type;
  readonly __values: Values;
  /**
   * @internal
   */
  readonly __parse?: (val: unknown) => Type;
  /**
   * @internal
   */
  readonly __modifiers?: Modifiers;
  /**
   * @internal
   */
  readonly __validate: (val: unknown) => Either<Type> | Next<Type>;
  toString(): string;
}

type Left<L> = { readonly _t: 'left'; readonly value: L };
type Right<R> = { readonly _t: 'right'; readonly value: R };

export type Either<R, L = ValidationError> = Left<L> | Right<R>;

export type SomeSchema<T> = Schema<T, DefaultValues, unknown>;

export type DefaultValues = SomeSchema<any> | Primitives | Functor<SomeSchema<any> | Primitives>;

export type Functor<T> = Record<string, T> | readonly T[];

export type TupleOf<
  T,
  Length extends number,
  Acc extends readonly unknown[] = readonly []
> = Acc['length'] extends Length ? Acc : TupleOf<T, Length, readonly [T, ...Acc]>;

type TypeOfSchema<S extends SomeSchema<any>> = S['__type'];

export type If<T, Condition, Y, N = never> = T extends Condition ? Y : N;

export type Pretty<X> = X extends Date
  ? X
  : X extends object | readonly unknown[]
  ? {
      readonly [K in keyof X]: X[K];
    }
  : X;

export type KeysOfType<T extends object, SelectedType> = {
  readonly [key in keyof T]: SelectedType extends T[key] ? key : never;
}[keyof T];

type PlainObject = { readonly [name: string]: any };
export type Optional<T extends object> = Partial<Pick<T, KeysOfType<T, undefined>>>;
export type Required<T extends object> = Omit<T, KeysOfType<T, undefined>>;

export type UndefinedToOptional<T> = T extends PlainObject
  ? {} extends T
    ? {}
    : T extends Date | readonly unknown[]
    ? T
    : Pretty<Required<T> & Optional<T>>
  : T;

export type IfAny<X, Y, N = X> = 0 extends 1 & X
  ? Y
  : X extends readonly unknown[]
  ? IfAny<X[number], Y, N>
  : N;
