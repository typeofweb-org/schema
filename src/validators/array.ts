/* eslint-disable functional/no-loop-statement */
import { ValidationError } from '../errors';
import { refine } from '../refine';
import { schemaToString, typeToPrint } from '../stringify';
import type { SomeSchema, TypeOf, Either, Next } from '../types';

export const array = <U extends readonly SomeSchema<unknown>[]>(...validators: readonly [...U]) => {
  type TypeOfResult = readonly TypeOf<U[number]>[];

  return refine(
    function (values, t) {
      if (!Array.isArray(values)) {
        return t.left({
          expected: 'array',
          got: values,
        });
      }

      let isError = false;
      const result = new Array(values.length);
      valuesLoop: for (let i = 0; i < values.length; ++i) {
        const value = values[i]! as unknown;
        let r: Either<unknown> | Next<unknown> | undefined = undefined;
        let validator: U[number] | undefined = undefined;
        for (let k = 0; k < validators.length; ++k) {
          validator = validators[k]!;
          r = validator.__validate(value);
          if (r._t === 'right' || r._t === 'nextValid') {
            result[i] = r.value;
            continue valuesLoop;
          }
        }
        if (r && validator && (r._t === 'nextNotValid' || r._t === 'left')) {
          result[i] = new ValidationError(validator, value, r);
          isError = true;
        }
        continue;
      }

      if (isError) {
        return t.left({
          expected: 'array',
          got: result as TypeOfResult,
        });
      }
      return t.nextValid(result as TypeOfResult);
    },
    () => {
      const str = validators.map((s) => schemaToString(s)).join(' | ');
      return validators.length > 1 ? typeToPrint(`(${str})[]`) : typeToPrint(`${str}[]`);
    },
  );
};
