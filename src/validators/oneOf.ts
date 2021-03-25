/* eslint-disable functional/no-loop-statement */
import { ErrorDataBasic } from '../errors';
import { refine } from '../refine';
import { isSchema } from '../schema';
import { schemaToString } from '../stringify';
import type { Primitives, SomeSchema, TypeOf } from '../types';

// `U extends (Primitives)[]` and `[...U]` is a trick to force TypeScript to narrow the type correctly
// thanks to this, there's no need for "as const": oneOf(['a', 'b']) works as oneOf(['a', 'b'] as const)
export const oneOf = <U extends readonly (Primitives | SomeSchema<any>)[]>(
  validatorsOrLiterals: readonly [...U],
) => {
  type TypeOfResult = {
    readonly [Index in keyof U]: U[Index] extends SomeSchema<any> ? TypeOf<U[Index]> : U[Index];
  }[number];

  return refine(
    function (value, t) {
      for (let i = 0; i < validatorsOrLiterals.length; ++i) {
        const valueOrSchema = validatorsOrLiterals[i];
        if (isSchema(valueOrSchema)) {
          const r = valueOrSchema.__validate(value);
          if (r._t === 'right') {
            return t.right(r.value as TypeOfResult);
          } else if (r._t === 'nextValid') {
            return t.nextValid(r.value as TypeOfResult);
          }
          continue;
        } else {
          if (value === valueOrSchema) {
            return t.right(valueOrSchema as TypeOfResult);
          }
        }
      }
      return t.left(new ErrorDataBasic('oneOf', value as TypeOfResult));
    },
    () => {
      const str = validatorsOrLiterals
        .map((s) => (isSchema(s) ? schemaToString(s) : JSON.stringify(s)))
        .join(' | ');

      return validatorsOrLiterals.length > 1 ? `(${str})` : str;
    },
  );
};
