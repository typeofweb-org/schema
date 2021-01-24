import type { SomeSchema, TypeOf } from '..';
import { ValidationError } from '../errors';
import type { Either } from '../types';

export const validate = <S extends SomeSchema<any>>(schema: S) => (value: unknown) => {
  const result = __validate<S>(schema, value);
  if (result._t === 'right') {
    return result.value;
  } else {
    // throw result.value;
    throw new ValidationError(schema, value);
  }
};

export const __validate = <S extends SomeSchema<any>>(
  schema: S,
  value: unknown,
): Either<TypeOf<S>> => {
  // @todo rethink modifiers
  if (schema.__modifiers.nullable && value === null) {
    return { _t: 'right', value: value as TypeOf<S> };
  }
  if (schema.__modifiers.optional && value === undefined) {
    return { _t: 'right', value: value as TypeOf<S> };
  }

  if (typeof schema.__modifiers.minLength === 'number') {
    if (typeof value !== 'string' && !Array.isArray(value)) {
      return { _t: 'left', value: new ValidationError(schema, value) };
    }
    if (value.length < schema.__modifiers.minLength) {
      return { _t: 'left', value: new ValidationError(schema, value) };
    }
  }

  const parsedValue: unknown = schema.__parse ? schema.__parse(value) : value;
  return schema.__validate(schema, parsedValue);
};
