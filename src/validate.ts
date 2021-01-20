import { ValidationError } from './errors';
import { parse } from './parse';
import type { SomeSchema } from './types';
import { isDate } from './utils';
import type { OneOfSchema, TupleSchema } from './validators';
import {
  ONE_OF_VALIDATOR,
  TUPLE_VALIDATOR,
  STRING_VALIDATOR,
  NUMBER_VALIDATOR,
  BOOLEAN_VALIDATOR,
  DATE_VALIDATOR,
  isSchema,
  isOptionalSchema,
  UNKNOWN_VALIDATOR,
} from './validators';

import type { AnySchema, TypeOf } from '.';

const assertUnreachable = (val: never): never => {
  /* istanbul ignore next */
  throw new Error(val);
};

export const validate = <S extends SomeSchema<any>>(schema: S) => (value: unknown) =>
  __validate<S>(schema, value);

const __validate = <S extends SomeSchema<any>>(schema: S, value: unknown): TypeOf<S> => {
  if (schema.__validator === UNKNOWN_VALIDATOR) {
    return value as TypeOf<S>;
  }

  if (value === undefined) {
    if (schema.__modifiers.optional) {
      return value as TypeOf<S>;
    } else {
      throw new ValidationError(schema, value);
    }
  }

  if (value === null) {
    if (schema.__modifiers.nullable) {
      return value as TypeOf<S>;
    } else {
      throw new ValidationError(schema, value);
    }
  }

  if (Array.isArray(schema.__validator)) {
    if (!Array.isArray(value)) {
      throw new ValidationError(schema, value);
    }
    if (
      typeof schema.__modifiers.minLength === 'number' &&
      value.length < schema.__modifiers.minLength
    ) {
      throw new ValidationError(schema, value);
    }
    const validators = schema.__validator as readonly AnySchema[];
    return value.map((val: unknown) => {
      const validationResult = validators.reduce(
        (acc, validator) => {
          if (acc.isValid) {
            return acc;
          }
          try {
            const result: unknown = __validate(validator, val);
            return { isValid: true, result };
          } catch {}
          return { isValid: false, result: undefined };
        },
        { isValid: false, result: undefined as unknown },
      );
      if (validationResult.isValid) {
        return validationResult.result;
      }
      throw new ValidationError(schema, value);
    }) as TypeOf<S>;
  }

  if (typeof schema.__validator === 'object') {
    if (typeof value !== 'object') {
      throw new ValidationError(schema, value);
    }
    const validators = schema.__validator as Record<string, AnySchema>;

    const valueKeys = Object.keys(value!);

    const validatorEntries = Object.entries(validators);
    const allValidatorKeysCount = validatorEntries.length;
    const requiredValidatorKeysCount = validatorEntries.reduce(
      (acc, [_, schema]) => acc + (isOptionalSchema(schema) ? 0 : 1),
      0,
    );

    if (valueKeys.length > allValidatorKeysCount || valueKeys.length < requiredValidatorKeysCount) {
      throw new ValidationError(schema, value);
    }

    type Item = TypeOf<S>[keyof TypeOf<S>];

    const obj = validatorEntries.reduce((acc, [key, validator]) => {
      const valueForValidator: unknown = value?.[key as keyof typeof value];
      acc[key] = __validate(validator, valueForValidator) as Item;
      return acc;
    }, {} as Record<string, Item>);

    // const obj = valueEntries.reduce((acc, [key, val]) => {
    //   if (!validators[key]) {
    //     throw new ValidationError(schema, value);
    //   }
    //   acc[key] = __validate(validators[key]!, val) as Item;
    //   return acc;
    // }, {} as Record<string, Item>);

    return obj as TypeOf<S>;
  }

  const parsedValue = parse(schema.__validator)(value);
  switch (schema.__validator) {
    case STRING_VALIDATOR:
      if (typeof parsedValue !== 'string') {
        throw new ValidationError(schema, value);
      }
      if (
        typeof schema.__modifiers.minLength === 'number' &&
        parsedValue.length < schema.__modifiers.minLength
      ) {
        throw new ValidationError(schema, value);
      }
      return parsedValue as TypeOf<S>;
    case NUMBER_VALIDATOR:
      if (typeof parsedValue !== 'number' || Number.isNaN(parsedValue)) {
        throw new ValidationError(schema, value);
      }
      return parsedValue as TypeOf<S>;
    case BOOLEAN_VALIDATOR:
      if (typeof parsedValue !== 'boolean') {
        throw new ValidationError(schema, value);
      }
      return parsedValue as TypeOf<S>;
    case DATE_VALIDATOR:
      if (!isDate(parsedValue) || Number.isNaN(Number(parsedValue))) {
        throw new ValidationError(schema, value);
      }
      return parsedValue as TypeOf<S>;
    case ONE_OF_VALIDATOR:
      const s = schema as OneOfSchema;
      const validationResult = s.__values.reduce<{
        readonly isValid: boolean;
        readonly result: unknown;
      }>(
        (acc, valueOrValidator) => {
          if (acc.isValid) {
            return acc;
          }
          if (isSchema(valueOrValidator)) {
            try {
              const result = __validate(valueOrValidator, value);
              return { isValid: true, result };
            } catch {}
            return { isValid: false, result: undefined };
          } else {
            const isValid = value === valueOrValidator;
            return { isValid, result: isValid ? valueOrValidator : undefined };
          }
        },
        { isValid: false, result: undefined },
      );
      if (!validationResult.isValid) {
        throw new ValidationError(s, value);
      }
      return validationResult.result as TypeOf<S>;

    case TUPLE_VALIDATOR: {
      const s = schema as TupleSchema;
      if (!Array.isArray(value) || value.length !== s.__values.length) {
        throw new ValidationError(s, value);
      }
      const validationResult = s.__values.reduce(
        (acc, valueOrValidator, index) => {
          if (!acc.isValid) {
            return acc;
          }
          if (isSchema(valueOrValidator)) {
            try {
              const result: unknown = __validate(valueOrValidator, value[index]);
              return { isValid: true, result };
            } catch {}
            return { isValid: false, result: undefined };
          } else {
            return { isValid: value[index] === valueOrValidator, result: valueOrValidator };
          }
        },
        { isValid: true, result: undefined as unknown },
      );
      if (!validationResult.isValid) {
        throw new ValidationError(s, value);
      }
      return validationResult.result as TypeOf<S>;
    }
  }

  /* istanbul ignore next */
  return assertUnreachable(schema.__validator);
};
