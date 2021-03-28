export type TypeOf<S extends SomeSchema<any>> = Pretty<S['__type']>;

export type Primitives = string | number | boolean;

export interface Schema<Type extends unknown> {
  readonly __type: Type;
  /**
   * @internal
   */
  readonly __validate: (val: unknown) => Either<Type> | Next<Type>;
  toString(): string;
}

type Left<L> = { readonly _t: 'left'; readonly value: L };
type Right<R> = { readonly _t: 'right'; readonly value: R };

type NextNotValid<L> = { readonly _t: 'nextNotValid'; readonly value: L };
type NextValid<R> = { readonly _t: 'nextValid'; readonly value: R };
export type Next<R, L extends ErrorData = ErrorData> = NextNotValid<L> | NextValid<R>;
export type Either<R, L extends ErrorData = ErrorData> = Left<L> | Right<R>;

export type SomeSchema<T> = Schema<T>;

export type TupleOf<
  T,
  Length extends number,
  Acc extends readonly unknown[] = readonly []
> = Acc['length'] extends Length ? Acc : TupleOf<T, Length, readonly [T, ...Acc]>;

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

export interface ErrorDataBasic {
  readonly expected: string;
  readonly got: unknown;
  readonly args?: ReadonlyArray<unknown>;
}

export interface ErrorDataObjectEntry {
  readonly path: string;
  readonly error: ErrorData;
}

export interface ErrorDataObject extends ErrorDataBasic {
  readonly errors: ReadonlyArray<ErrorDataObjectEntry>;
}

export type ErrorData = ErrorDataObject | ErrorDataBasic;
