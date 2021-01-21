/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import { isOptionalSchema } from '../modifiers/optional';
import type { Schema, SomeSchema, TypeOf, UndefinedToOptional } from '../types';

import { __mapEither } from './__mapEither';
import { TYPEOFWEB_SCHEMA, InitialModifiers } from './__schema';
import { schemaToString } from './__stringify';
import { objectToPrint, quote } from './__stringifyHelpers';
import { __validate } from './__validate';

export type ObjectSchema = ReturnType<typeof object>;
export const object = <U extends Record<string, SomeSchema<any>>>(obj: U) => {
  type TypeOfResult = UndefinedToOptional<
    {
      readonly [K in keyof U]: TypeOf<U[K]>;
    }
  >;

  return {
    [TYPEOFWEB_SCHEMA]: true,
    __validator: obj,
    __modifiers: InitialModifiers,
    __type: {} as never,
    __values: {} as never,
    toString() {
      const entries = Object.entries(this.__validator).map(
        ([key, val]) => [key, schemaToString(val)] as const,
      );
      if (entries.length === 0) {
        return objectToPrint('');
      }
      return objectToPrint(
        ' ' + entries.map(([key, val]) => quote(key) + ': ' + val).join(', ') + ' ',
      );
    },
    __validate(_schema, value: Record<string, unknown>) {
      if (typeof value !== 'object' || value === null) {
        return { _t: 'left', value: new ValidationError(this, value) };
      }
      const validators = this.__validator as Record<string, SomeSchema<any>>;

      const valueKeys = Object.keys(value);

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

      return __mapEither<Record<string, SomeSchema<any>>, TypeOfResult>((validator, key) => {
        const valueForValidator = value[key];
        return __validate(validator, valueForValidator) as Exclude<
          TypeOfResult[keyof TypeOfResult],
          undefined
        >;
      }, validators);
    },
  } as Schema<TypeOfResult, typeof InitialModifiers, never, U>;
};

export const isRecordSchema = (s: SomeSchema<any>): s is ObjectSchema =>
  !Array.isArray(s.__validator) && typeof s.__validator === 'object';
