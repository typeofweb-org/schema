import type { AnySchema } from '../src';
import {
  array,
  boolean,
  date,
  isSchema,
  minLength,
  nil,
  nonEmpty,
  nullable,
  number,
  object,
  oneOf,
  optional,
  string,
  validate,
  ValidationError,
} from '../src';

describe('@typeofweb/schema unit tests', () => {
  it('date validator should not accept invalid date', () => {
    expect(() => validate(date())(new Date(' '))).toThrowError(ValidationError);
  });

  it('should detect schemas', () => {
    const validators: ReadonlyArray<() => AnySchema> = [
      boolean,
      date,
      number,
      string,
      () => object({}),
      () => array(string()),
      () => oneOf(['a']),
    ];

    const modifiers: ReadonlyArray<(schema: AnySchema) => AnySchema> = [
      minLength(123),
      nil,
      nonEmpty,
      nullable,
      optional,
    ];

    validators.forEach((v) => {
      expect(isSchema(v())).toBe(true);
      modifiers.forEach((m) => {
        expect(isSchema(m(v()))).toBe(true);
      });
    });
  });
});
