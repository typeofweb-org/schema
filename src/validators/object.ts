/* eslint-disable functional/no-loop-statement */
import { refine } from '../refine';
import { schemaToString, objectToPrint, quote } from '../stringify';
import type { SomeSchema, TypeOf, UndefinedToOptional } from '../types';

export interface ObjectSchemaOptions {
  readonly allowUnknownKeys?: boolean;
}

export const object = <U extends Record<string, SomeSchema<any>>>(
  schemasObject: U,
  options?: ObjectSchemaOptions,
) => {
  type TypeOfResult = UndefinedToOptional<
    {
      readonly [K in keyof U]: TypeOf<U[K]>;
    }
  >;

  function objectToString() {
    const entries = Object.entries(schemasObject).map(
      ([key, val]) => [key, schemaToString(val)] as const,
    );
    if (entries.length === 0) {
      return objectToPrint('');
    }
    return objectToPrint(
      ' ' + entries.map(([key, val]) => quote(key) + ': ' + val).join(', ') + ' ',
    );
  }

  return refine(function (obj, t) {
    if (typeof obj !== 'object' || obj === null) {
      return t.left(objectToString());
    }
    const object = obj as Record<string, unknown>;

    const validators = schemasObject as Record<string, SomeSchema<any>>;
    const allowUnknownKeys = !!options?.allowUnknownKeys;

    let isError = false;
    const result = {} as Record<string, unknown>;
    const errors = {} as Record<string, unknown>;
    for (const key in object) {
      if (!Object.prototype.hasOwnProperty.call(object, key)) {
        continue;
      }
      const value = object[key];

      const validator = validators[key];
      if (validator) {
        const r = validator.__validate(value);
        if (r._t === 'left') {
          errors[key] = { expected: r.value, got: value };
        } else {
          result[key] = r.value;
        }
        isError ||= r._t === 'left';
        continue;
      } else {
        if (allowUnknownKeys) {
          result[key] = value;
          continue;
        } else {
          isError = true;
          errors[key] = { got: value };
          continue;
        }
      }
    }

    for (const key in validators) {
      if (!Object.prototype.hasOwnProperty.call(validators, key)) {
        continue;
      }
      if (key in result) {
        continue;
      }
      const validator = validators[key]!;
      const value = object[key];
      const r = validator.__validate(value);
      if (r._t === 'left') {
        errors[key] = { expected: r.value, got: value };
        isError = true;
      }
    }

    if (isError) {
      return t.left(errors as TypeOfResult);
    }
    return t.nextValid(result as TypeOfResult);
  }, objectToString);
};
