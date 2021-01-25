import { ValidationError } from '../errors';
import { initialModifiers } from '../schema';
import { schemaToString, objectToPrint, quote } from '../stringify';
import type { Schema, SomeSchema, TypeOf, UndefinedToOptional } from '../types';
import { left, right } from '../utils/either';
import { sequenceA } from '../utils/sequenceA';

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
    toString: toStringObject,
    __validate: validateObject,
  } as Schema<TypeOfResult, typeof initialModifiers, U>;
};

function toStringObject<
  U extends Record<string, SomeSchema<any>>,
  TypeOfResult = UndefinedToOptional<
    {
      readonly [K in keyof U]: TypeOf<U[K]>;
    }
  >
>(this: Schema<TypeOfResult, typeof initialModifiers, U>) {
  const entries = Object.entries(this.__values).map(
    ([key, val]) => [key, schemaToString(val)] as const,
  );
  if (entries.length === 0) {
    return objectToPrint('');
  }
  return objectToPrint(' ' + entries.map(([key, val]) => quote(key) + ': ' + val).join(', ') + ' ');
}

function validateObject<
  U extends Record<string, SomeSchema<any>>,
  TypeOfResult extends UndefinedToOptional<
    {
      readonly [K in keyof U]: TypeOf<U[K]>;
    }
  >
>(this: Schema<TypeOfResult, typeof initialModifiers, U>, value: Record<string, unknown>) {
  if (typeof value !== 'object' || value === null) {
    return left(new ValidationError(this, value));
  }
  const validators = this.__values as Record<string, SomeSchema<any>>;
  const valueKeys = Object.keys(value);
  const validatorsKeys = Object.keys(validators);

  const result = sequenceA<readonly string[], readonly (readonly [string, unknown])[]>(
    (key) => {
      if (!validators[key as keyof typeof validators]) {
        if (this.__modifiers.allowUnknownKeys) {
          return right([key, value[key as keyof typeof validators]]);
        }
        return left([key, new ValidationError(this, value[key as keyof typeof validators])]);
      }
      const validationResult = validators[key as keyof typeof validators]?.__validate(
        value[key as keyof typeof validators],
      );
      return validationResult?._t === 'left'
        ? left([key, validationResult.value])
        : right([key, validationResult?.value]);
    },
    this.__modifiers.allowUnknownKeys
      ? validatorsKeys
      : [...new Set([...valueKeys, ...validatorsKeys])],
  );

  return result._t === 'left'
    ? left(result.value)
    : right(Object.fromEntries(result.value) as TypeOfResult);
}
