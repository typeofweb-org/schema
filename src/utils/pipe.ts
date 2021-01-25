import type { SomeSchema } from '../types';

type Modifier<S1, S2> = (arg: S1) => S2;
type SchemaArg<S> = (() => S) | S;
// prettier-ignore
export function pipe<S1>(schema: SchemaArg<S1>): S1;
// prettier-ignore
export function pipe<S1, S2>(schema: SchemaArg<S1>, mod1: Modifier<S1, S2>): S2;
// prettier-ignore
export function pipe<S1, S2, S3>(schema: SchemaArg<S1>, mod1: Modifier<S1, S2>, mod2: Modifier<S2, S3>): S3;
// prettier-ignore
export function pipe<S1, S2, S3, S4>(schema: SchemaArg<S1>, mod1: Modifier<S1, S2>, mod2: Modifier<S2, S3>, mod3: Modifier<S3, S4>): S4;
// prettier-ignore
export function pipe<S1, S2, S3, S4, S5>(schema: SchemaArg<S1>, mod1: Modifier<S1, S2>, mod2: Modifier<S2, S3>, mod3: Modifier<S3, S4>, mod4: Modifier<S4, S5>): S5;
// prettier-ignore
export function pipe<S1, S2, S3, S4, S5, S6>(schema: SchemaArg<S1>, mod1: Modifier<S1, S2>, mod2: Modifier<S2, S3>, mod3: Modifier<S3, S4>, mod4: Modifier<S4, S5>, mod5: Modifier<S5, S6>): S6;
export function pipe<T extends SomeSchema<any>>(
  schema: SchemaArg<T>,
  ...rest: readonly ((...args: readonly any[]) => any)[]
) {
  return rest.reduce((acc, mod) => mod(acc), typeof schema === 'function' ? schema() : schema);
}
export const λ = pipe;
