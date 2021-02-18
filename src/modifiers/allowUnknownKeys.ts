import type { Schema, SomeSchema } from '../types';

export const allowUnknownKeys = <S extends SomeSchema<object>>(schema: S) =>
  ({
    ...schema,
  } as Schema<S['__type'], S['__values']>);
