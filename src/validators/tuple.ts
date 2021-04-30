/* eslint-disable functional/no-loop-statement */
import { ValidationError } from '../errors';
import { refine } from '../refine';
import { isSchema } from '../schema';
import { schemaToString } from '../stringify';
import type { SomeSchema, TypeOf, Primitives } from '../types';

export const tuple = <U extends readonly (Primitives | SomeSchema<any>)[]>(
  validatorsOrLiterals: readonly [...U],
) => {
  type TypeOfResult = {
    readonly [Index in keyof U]: U[Index] extends SomeSchema<any> ? TypeOf<U[Index]> : U[Index];
  };

  return refine(
    function (values, t) {
      if (!Array.isArray(values) || values.length !== validatorsOrLiterals.length) {
        return t.left(values);
      }

      let isError = false;
      const result = new Array(values.length);
      for (let i = 0; i < values.length; ++i) {
        const valueOrSchema = validatorsOrLiterals[i];
        const value = values[i] as unknown;

        if (isSchema(valueOrSchema)) {
          const r = valueOrSchema.__validate(value);
          result[i] = r.value as unknown;
          isError ||= r._t === 'left';
          continue;
        } else {
          if (valueOrSchema === value) {
            result[i] = value;
            continue;
          } else {
            result[i] = new ValidationError(this, validatorsOrLiterals);
            isError = true;
            continue;
          }
        }
      }

      if (isError) {
        return t.left((result as unknown) as TypeOfResult);
      }
      return t.nextValid((result as unknown) as TypeOfResult);
    },
    () => [
      '[' +
        validatorsOrLiterals
          .map((s) => (isSchema(s) ? schemaToString(s) : JSON.stringify(s)))
          .join(', ') +
        ']',
    ],
  );
};
