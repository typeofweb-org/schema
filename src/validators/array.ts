/* eslint-disable functional/no-loop-statement */
import { ValidationError } from '../errors';
import { refine } from '../refine';
import { schemaToString } from '../stringify';
import type { SomeSchema, TypeOf } from '../types';

export const array = <U extends readonly SomeSchema<unknown>[]>(...validators: readonly [...U]) => {
  type TypeOfResult = readonly TypeOf<U[number]>[];

  return refine(
    function (values, t) {
      if (!Array.isArray(values)) {
        return t.left(values);
      }

      let isError = false;
      const result = new Array(values.length);
      valuesLoop: for (let i = 0; i < values.length; ++i) {
        const value = values[i]! as unknown;
        for (let k = 0; k < validators.length; ++k) {
          const validator = validators[k]!;
          const r = validator.__validate(value);
          if (r._t === 'right' || r._t === 'nextValid') {
            result[i] = r.value;
            continue valuesLoop;
          }
        }
        result[i] = new ValidationError(this, values);
        isError = true;
        continue;
      }

      if (isError) {
        return t.left(result as TypeOfResult);
      }
      return t.nextValid(result as TypeOfResult);
    },
    () => {
      const str = validators.map((s) => schemaToString(s)).join(' | ');
      return [validators.length > 1 ? `(${str})[]` : `${str}[]`];
    },
  );
};
