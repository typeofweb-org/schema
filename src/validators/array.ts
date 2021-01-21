/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import type { Either, Schema, SomeSchema, TypeOf } from '../types';
import { TYPEOFWEB_SCHEMA, InitialModifiers } from '../validators';

import { __validate } from './__validate';

export type ArraySchema = ReturnType<typeof array>;
export const array = <U extends readonly SomeSchema<unknown>[]>(...arr: readonly [...U]) => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: arr,
    __modifiers: InitialModifiers,
    __type: {} as unknown,
    __values: {} as unknown,
    __validate(_schema, value) {
      if (!Array.isArray(value)) {
        return { _t: 'left', value: new ValidationError(this, value) };
      }
      if (
        typeof this.__modifiers.minLength === 'number' &&
        value.length < this.__modifiers.minLength
      ) {
        return { _t: 'left', value: new ValidationError(this, value) };
      }

      return value.map((val: unknown) => {
        return this.__validator.reduce(
          (acc, schema) => {
            if (acc._t === 'right') {
              return acc;
            }
            return __validate(schema, val);
          },
          { _t: 'left', value: new ValidationError(this, value) } as Either<
            unknown,
            ValidationError
          >,
        );
      });
    },
  } as Schema<readonly TypeOf<U[number]>[], typeof InitialModifiers, never, U>;
};
