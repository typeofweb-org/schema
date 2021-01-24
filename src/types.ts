import type { ValidationError } from './errors';

export type TypeOf<S extends SomeSchema<any>> = Pretty<TypeOfModifiers<S> | TypeOfSchema<S>>;

export type Primitives = string | number | boolean;
export type Json = Primitives | { readonly [prop in string | number]: Json } | readonly Json[];
export interface Schema<
  Type extends unknown,
  Modifiers extends DefaultModifiers,
  Values extends DefaultValues
> {
  readonly __type: Type;
  readonly __values: Values;
  readonly __modifiers: Modifiers;
  /**
   * @internal
   */
  readonly __parse?: (val: unknown) => Type;
  /**
   * @internal
   */
  readonly __validate: (val: unknown) => Either<Type>;
  toString(): string;
}

export type Either<R, L = ValidationError> =
  | { readonly _t: 'left'; readonly value: L }
  | { readonly _t: 'right'; readonly value: R };

export type DefaultModifiers = {
  readonly optional: boolean | undefined;
  readonly nullable: boolean | undefined;
  readonly allowUnknownKeys: boolean | undefined;
  readonly minLength: number | undefined;
};

export type MergeModifiers<
  M extends DefaultModifiers,
  V extends Partial<DefaultModifiers>
> = Pretty<
  {
    readonly [K in keyof DefaultModifiers]: K extends keyof V ? V[K] : M[K];
  }
>;

export type SomeSchema<T> = Schema<T, DefaultModifiers, DefaultValues>;

type DefaultValues = SomeSchema<any> | Primitives | Functor<SomeSchema<any> | Primitives>;

export type Functor<T> = Record<string, T> | readonly T[];

export type TupleOf<
  T,
  Length extends number,
  Acc extends readonly unknown[] = readonly []
> = Acc['length'] extends Length ? Acc : TupleOf<T, Length, readonly [T, ...Acc]>;

type TypeOfModifiers<S extends SomeSchema<any>> =
  | If<S['__modifiers'], { readonly optional: true }, undefined>
  | If<S['__modifiers'], { readonly nullable: true }, null>;

type TypeOfSchema<S extends SomeSchema<any>> = S['__type'];

type If<T, Condition, Y, N = never> = T extends Condition ? Y : N;

export type Pretty<X> = X extends Date
  ? X
  : X extends object | readonly unknown[]
  ? {
      readonly [K in keyof X]: X[K];
    }
  : X;

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
    : Required<T> & Optional<T>
  : T;
