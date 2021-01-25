import type { MergeModifiers, Schema, SomeSchema } from '../types';

export const allowUnknownKeys = <S extends SomeSchema<object>>(schema: S) =>
  ({
    ...schema,
    __modifiers: { ...schema.__modifiers, allowUnknownKeys: true },
  } as Schema<
    S['__type'],
    MergeModifiers<S['__modifiers'], { readonly allowUnknownKeys: true }>,
    S['__values']
  >);
