import { AnySchema, Schema } from './types';

export const optional = <S extends AnySchema>(schema: S) => {
  return {
    ...schema,
    __modifiers: {
      ...schema.__modifiers,
      optional: true,
    },
  } as Schema<
    S['__type'],
    { nullable: S['__modifiers']['nullable']; optional: true },
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
    { nullable: true; optional: S['__modifiers']['optional'] },
    S['__values'][number]
  >;
};
