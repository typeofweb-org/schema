import { nullable } from '../modifiers/nullable';
import { optional } from '../modifiers/optional';
import type { SomeSchema } from '../types';

export const nil = <S extends SomeSchema<any>>(schema: S) => {
  return nullable(optional(schema));
};
