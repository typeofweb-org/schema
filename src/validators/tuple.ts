/* eslint-disable functional/no-loop-statement */
import { refine } from '../refine';
import { isSchema } from '../schema';
import { schemaToString } from '../stringify';

import type { SomeSchema, TypeOf, ErrorDataEntry } from '../types';

export const tuple = <U extends readonly SomeSchema<any>[]>(
  validatorsOrLiterals: readonly [...U],
) => {
  type TypeOfResult = {
    readonly [Index in keyof U]: U[Index] extends SomeSchema<any> ? TypeOf<U[Index]> : U[Index];
  };

  return refine(
    function (values, t) {
      if (!Array.isArray(values) || values.length !== validatorsOrLiterals.length) {
        return t.left({
          expected: 'tuple',
          got: values,
        });
      }

      let isError = false;
      const result = new Array(values.length);
      // eslint-disable-next-line functional/prefer-readonly-type
      const errors: Array<ErrorDataEntry> = [];
      for (let i = 0; i < values.length; ++i) {
        const schema = validatorsOrLiterals[i];
        const value = values[i] as unknown;

        const r = schema.__validate(value);
        result[i] = r.value as unknown;
        if (r._t === 'left') {
          isError = true;
          errors.push({
            path: i,
            error: r.value,
          });
        }
      }

      if (isError) {
        return t.left({ expected: 'tuple', got: values, errors });
      }
      return t.nextValid(result as unknown as TypeOfResult);
    },
    () =>
      '[' +
      validatorsOrLiterals
        .map((s) => (isSchema(s) ? schemaToString(s) : JSON.stringify(s)))
        .join(', ') +
      ']',
  );
};
