/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import { isOptionalSchema } from '../modifiers/optional';
import type { Schema, SomeSchema, TypeOf, UndefinedToOptional } from '../types';

import { __mapEither } from './__mapEither';
import { initialModifiers } from './__schema';
import { schemaToString } from './__stringify';
import { objectToPrint, quote } from './__stringifyHelpers';
import { __validate } from './__validate';

export const object = <U extends Record<string, SomeSchema<any>>>(obj: U) => {
  type TypeOfResult = UndefinedToOptional<
    {
      readonly [K in keyof U]: TypeOf<U[K]>;
    }
  >;

  return {
    __modifiers: initialModifiers,
    __type: {} as TypeOfResult,
    __values: obj,
    toString() {
      const entries = Object.entries(this.__values).map(
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
      const validators = this.__values as Record<string, SomeSchema<any>>;

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
  } as Schema<TypeOfResult, typeof initialModifiers, U>;
};
