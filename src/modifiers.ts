import type { GetModifiers2, Schema, SomeSchema, TupleOf } from './types';

export const optional = <S extends SomeSchema<any>>(schema: S) => {
  return {
    ...schema,
    __modifiers: {
      ...schema.__modifiers,
      optional: true,
    },
  } as Schema<
    S['__type'],
    GetModifiers2<S['__modifiers'], { readonly optional: true }>,
    S['__values'],
    S['__validator']
  >;
};

export const nullable = <S extends SomeSchema<any>>(schema: S) => {
  return {
    ...schema,
    __modifiers: {
      ...schema.__modifiers,
      nullable: true,
    },
  } as Schema<
    S['__type'],
    GetModifiers2<S['__modifiers'], { readonly nullable: true }>,
    S['__values'],
    S['__validator']
  >;
};

export const nil = <S extends SomeSchema<any>>(schema: S) => {
  return {
    ...schema,
    __modifiers: {
      ...schema.__modifiers,
      optional: true,
      nullable: true,
    },
  } as Schema<
    S['__type'],
    GetModifiers2<
      S['__modifiers'],
      {
        readonly nullable: true;
        readonly optional: true;
      }
    >,
    S['__values'],
    S['__validator']
  >;
};

export const minLength = <L extends number>(length: L) => <
  S extends SomeSchema<string> | SomeSchema<readonly unknown[]>
>(
  schema: S,
) => {
  return ({
    ...schema,
    __modifiers: {
      ...schema.__modifiers,
      minLength: length,
    },
  } as unknown) as Schema<
    S['__type'] extends readonly unknown[]
      ? readonly [...TupleOf<S['__type'][number], L>, ...S['__type']]
      : S['__type'],
    GetModifiers2<
      S['__modifiers'],
      {
        readonly minLength: L;
      }
    >,
    S['__values'],
    S['__validator']
  >;
};

export const nonEmpty = minLength(1);
