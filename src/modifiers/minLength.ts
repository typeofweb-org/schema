import type { SomeSchema, Schema, TupleOf, MergeModifiers } from '../types';

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
    MergeModifiers<
      S['__modifiers'],
      {
        readonly minLength: L;
      }
    >,
    S['__values'],
    S['__validator']
  >;
};
