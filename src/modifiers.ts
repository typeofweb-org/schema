import type { Schema, SomeSchema, AnySchema, TupleOf } from './types';

export const optional = <S extends AnySchema>(schema: S) => {
  return {
    ...schema,
    __modifiers: {
      ...schema.__modifiers,
      optional: true,
    },
  } as Schema<
    S['__type'],
    {
      readonly nullable: S['__modifiers']['nullable'];
      readonly optional: true;
      readonly minLength: S['__modifiers']['minLength'];
    },
    S['__values'],
    S['__validator']
  >;
};

export const nullable = <S extends AnySchema>(schema: S) => {
  return {
    ...schema,
    __modifiers: {
      ...schema.__modifiers,
      nullable: true,
    },
  } as Schema<
    S['__type'],
    {
      readonly nullable: true;
      readonly optional: S['__modifiers']['optional'];
      readonly minLength: S['__modifiers']['minLength'];
    },
    S['__values'],
    S['__validator']
  >;
};

export const nil = <S extends AnySchema>(schema: S) => {
  return {
    ...schema,
    __modifiers: {
      ...schema.__modifiers,
      optional: true,
      nullable: true,
    },
  } as Schema<
    S['__type'],
    {
      readonly nullable: true;
      readonly optional: true;
      readonly minLength: S['__modifiers']['minLength'];
    },
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
    {
      readonly nullable: S['__modifiers']['nullable'];
      readonly optional: S['__modifiers']['optional'];
      readonly minLength: L;
    },
    S['__values'],
    S['__validator']
  >;
};

export const nonEmpty = minLength(1);
