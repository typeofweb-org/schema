import type { AnySchema, Schema, SomeSchema } from './types';

export const optional = <S extends AnySchema>(schema: S) => {
  return {
    ...schema,
    __modifiers: {
      ...schema.__modifiers,
      optional: true,
    },
  } as Schema<
    S['__type'],
    { readonly nullable: S['__modifiers']['nullable']; readonly optional: true },
    S['__values'][number]
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
    { readonly nullable: true; readonly optional: S['__modifiers']['optional'] },
    S['__values'][number]
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
    { readonly nullable: true; readonly optional: true },
    S['__values'][number]
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
    S['__type'],
    {
      readonly nullable: S['__modifiers']['nullable'];
      readonly optional: S['__modifiers']['optional'];
      readonly minLength: L;
    },
    S['__values'][number]
  >;
};

export const nonEmpty = minLength(1);
