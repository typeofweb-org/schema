/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import type { AnySchema, Either, Schema, SomeSchema, TypeOf, UndefinedToOptional } from '../types';
import { TYPEOFWEB_SCHEMA, InitialModifiers, isOptionalSchema } from '../validators';

import { __validate } from './__validate';

export type ObjectSchema = ReturnType<typeof object>;
export const object = <U extends Record<string, SomeSchema<any>>>(obj: U) => {
  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: obj,
    __modifiers: InitialModifiers,
    __type: {} as never,
    __values: {} as never,
    __validate(_schema, value) {
      if (typeof value !== 'object') {
        return { _t: 'left', value: new ValidationError(this, value) };
      }
      const validators = this.__validator as Record<string, AnySchema>;

      const valueKeys = Object.keys(value!);

      const validatorEntries = Object.entries(validators);
      const allValidatorKeysCount = validatorEntries.length;
      const requiredValidatorKeysCount = validatorEntries.reduce(
        (acc, [_, schema]) => acc + (isOptionalSchema(schema) ? 0 : 1),
        0,
      );

      if (
        valueKeys.length > allValidatorKeysCount ||
        valueKeys.length < requiredValidatorKeysCount
      ) {
        return { _t: 'left', value: new ValidationError(this, value) };
      }
      return validatorEntries.reduce(
        (acc, [key, validator]) => {
          if (acc._t === 'left') {
            return acc;
          }

          const valueForValidator: unknown = value?.[key as keyof typeof value];
          acc.value[key] = __validate(validator, valueForValidator);
          return acc;
        },
        { _t: 'right', value: {} } as Either<Record<string, unknown>>,
      );
    },
  } as Schema<
    UndefinedToOptional<
      {
        readonly [K in keyof U]: TypeOf<U[K]>;
      }
    >,
    typeof InitialModifiers,
    never,
    U
  >;
};
