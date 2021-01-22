import type { MergeModifiers, Schema, SomeSchema } from '../types';

export const optional = <S extends SomeSchema<any>>(schema: S) => {
  return {
    ...schema,
    __modifiers: {
      ...schema.__modifiers,
      optional: true,
    },
  } as Schema<
    S['__type'],
    MergeModifiers<S['__modifiers'], { readonly optional: true }>,
    S['__values']
  >;
};

export const isOptionalSchema = (
  s: SomeSchema<any>,
): s is SomeSchema<any> & { readonly __modifiers: { readonly optional: true } } =>
  !!s.__modifiers.optional;
