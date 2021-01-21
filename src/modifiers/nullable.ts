import type { SomeSchema, Schema, MergeModifiers } from '../types';

export const nullable = <S extends SomeSchema<any>>(schema: S) => {
  return {
    ...schema,
    __modifiers: {
      ...schema.__modifiers,
      nullable: true,
    },
  } as Schema<
    S['__type'],
    MergeModifiers<S['__modifiers'], { readonly nullable: true }>,
    S['__values'],
    S['__validator']
  >;
};
