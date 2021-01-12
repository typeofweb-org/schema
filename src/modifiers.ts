import type { AnySchema, Schema } from './types';

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
