import type { Pretty } from '@typeofweb/utils';

export type TypeOf<S extends SomeSchema<any>> = Pretty<S['__type']>;

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

export interface ErrorDataEntry {
  readonly path: keyof any;
  readonly error: ErrorData;
}

export interface ErrorData<T = unknown> {
  readonly expected: string;
  readonly got: T;
  readonly args?: ReadonlyArray<unknown>;
  readonly errors?: ReadonlyArray<ErrorDataEntry>;
}

export type SchemaRecord<Keys extends string> = {
  readonly [K in Keys]: SomeSchema<unknown>;
};

export type TypeOfRecord<T extends SchemaRecord<string>> = Pretty<
  {
    readonly [K in keyof T]: TypeOf<T[K]>;
  }
>;
