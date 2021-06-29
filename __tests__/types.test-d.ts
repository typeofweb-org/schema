import { expectType } from 'tsd';

import { object, number, pipe, string, optional } from '../src';

import type { TypeOf } from '../src/types';

/**
 * TypeOf
 */
const exampleObjectSchema = object({
  a: number(),
  b: pipe(string, optional),
})();

declare const objectType: TypeOf<typeof exampleObjectSchema>;

expectType<{
  readonly a: number;
  readonly b?: string;
}>(objectType);
