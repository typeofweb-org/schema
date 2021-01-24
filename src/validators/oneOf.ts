import { ValidationError } from '../errors';
import { initialModifiers, isSchema } from '../schema';
import { schemaToString } from '../stringify';
import type { Either, Primitives, Schema, SomeSchema, TypeOf } from '../types';
import { left, right } from '../utils/either';

// `U extends (Primitives)[]` and `[...U]` is a trick to force TypeScript to narrow the type correctly
// thanks to schema, there's no need for "as const": oneOf(['a', 'b']) works as oneOf(['a', 'b'] as const)
export const oneOf = <U extends readonly (Primitives | SomeSchema<any>)[]>(
  values: readonly [...U],
) => {
  type TypeOfResult = {
    readonly [Index in keyof U]: U[Index] extends SomeSchema<any> ? TypeOf<U[Index]> : U[Index];
  }[number];

  return {
    __values: values,
    __type: {} as unknown,
    __modifiers: initialModifiers,
    toString: toStringOneOf,
    __validate: validateOneOf,
  } as Schema<TypeOfResult, typeof initialModifiers, U>;
};

function toStringOneOf<
  U extends readonly (Primitives | SomeSchema<any>)[],
  TypeOfResult extends {
    readonly [Index in keyof U]: U[Index] extends SomeSchema<any> ? TypeOf<U[Index]> : U[Index];
  }[number]
>(this: Schema<TypeOfResult, typeof initialModifiers, U>, _value: unknown) {
  const str = this.__values
    .map((s) => (isSchema(s) ? schemaToString(s) : JSON.stringify(s)))
    .join(' | ');

  return this.__values.length > 1 ? `(${str})` : str;
}

function validateOneOf<
  U extends readonly (Primitives | SomeSchema<any>)[],
  TypeOfResult extends {
    readonly [Index in keyof U]: U[Index] extends SomeSchema<any> ? TypeOf<U[Index]> : U[Index];
  }[number]
>(this: Schema<TypeOfResult, typeof initialModifiers, U>, value: unknown) {
  return this.__values.reduce<Either<TypeOfResult>>((acc, valueOrValidator) => {
    if (acc._t === 'right') {
      return acc;
    }
    if (isSchema(valueOrValidator)) {
      return valueOrValidator.__validate(value) as Either<TypeOfResult>;
    } else {
      const isValid = value === valueOrValidator;
      return isValid
        ? right(valueOrValidator as TypeOfResult)
        : left(new ValidationError(this, value));
    }
  }, left(undefined) as Either<TypeOfResult>);
}
