import { ValidationError } from './errors';
import { parse } from './parse';
import type { AnySchema, TypeOf } from './types';
import {
  LITERAL_VALIDATOR,
  STRING_VALIDATOR,
  NUMBER_VALIDATOR,
  BOOLEAN_VALIDATOR,
  DATE_VALIDATOR,
} from './validators';

const assertUnreachable = (val: never): never => {
  /* istanbul ignore next */
  throw new Error(val);
};

export const validate = <S extends AnySchema>(schema: S) => (value: unknown): TypeOf<S> => {
  if (value === undefined) {
    if (schema.__modifiers.optional) {
      return value as TypeOf<S>;
    } else {
      throw new ValidationError();
    }
  }

  if (value === null) {
    if (schema.__modifiers.nullable) {
      return value as TypeOf<S>;
    } else {
      throw new ValidationError();
    }
  }

  if (Array.isArray(schema.__validator)) {
    const validators = schema.__validator as readonly AnySchema[];
    if (!Array.isArray(value)) {
      throw new ValidationError();
    }
    return value.map((val: unknown) => {
      const validationResult = validators.reduce(
        (acc, validator) => {
          if (acc.isValid) {
            return acc;
          }
          try {
            const result: unknown = validate(validator)(val);
            return { isValid: true, result };
          } catch {}
          return { isValid: false, result: undefined };
        },
        { isValid: false, result: undefined as unknown },
      );
      if (validationResult.isValid) {
        return validationResult.result;
      }
      throw new ValidationError();
    }) as TypeOf<S>;
  }

  if (typeof schema.__validator === 'object') {
    const validators = schema.__validator as Record<keyof any, AnySchema>;
    if (typeof value !== 'object') {
      throw new ValidationError();
    }

    const valueEntries = Object.entries(value!);
    const validatorEntries = Object.entries(validators);
    if (valueEntries.length !== validatorEntries.length) {
      throw new ValidationError();
    }

    valueEntries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
    validatorEntries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

    return Object.fromEntries(
      valueEntries.map(([key, val], index) => [key, validate(validatorEntries[index]![1])(val)]),
    ) as TypeOf<S>;
  }

  const parsedValue = parse(schema.__validator)(value);
  switch (schema.__validator) {
    case STRING_VALIDATOR:
      if (typeof parsedValue !== 'string') {
        throw new ValidationError();
      }
      return parsedValue as TypeOf<S>;
    case NUMBER_VALIDATOR:
      if (typeof parsedValue !== 'number' || Number.isNaN(parsedValue)) {
        throw new ValidationError();
      }
      return parsedValue as TypeOf<S>;
    case BOOLEAN_VALIDATOR:
      if (typeof parsedValue !== 'boolean') {
        throw new ValidationError();
      }
      return parsedValue as TypeOf<S>;
    case DATE_VALIDATOR:
      if (
        Object.prototype.toString.call(parsedValue) !== '[object Date]' ||
        Number.isNaN(Number(parsedValue))
      ) {
        throw new ValidationError();
      }
      return parsedValue as TypeOf<S>;
    case LITERAL_VALIDATOR:
      if (!schema.__values?.includes(parsedValue)) {
        throw new ValidationError();
      }
      return parsedValue as TypeOf<S>;
  }

  /* istanbul ignore next */
  return assertUnreachable(schema.__validator);
};
