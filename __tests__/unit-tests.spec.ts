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
import { isISODateString } from '../src/parse';

describe('@typeofweb/schema unit tests', () => {
  it('string validator should coerce Date to ISOString', () => {
    expect(validate(string())(new Date(0))).toBe('1970-01-01T00:00:00.000Z');
  });

  it('number validator should coerce string to number', () => {
    expect(validate(number())('3')).toBe(3);
  });

  it('number validator should not coerce empty string to 0', () => {
    expect(() => validate(number())('')).toThrowError(ValidationError);
  });

  it("isISODateString should return false for '0'", () => {
    expect(isISODateString('0')).toBe(false);
  });

  it('date validator should not accept invalid date', () => {
    expect(() => validate(date())(new Date(' '))).toThrowError(ValidationError);
  });

  it('date validator should not accept invalid ISODateString', () => {
    expect(() => validate(date())('123456789123456789123456789')).toThrow(ValidationError);
  });

  it('date validator should coerce ISOString to Date', () => {
    expect(validate(date())('1970-01-01T00:00:00.000Z')).toEqual(new Date(0));
  });

  it('date validator should coerce ISOString to Date', () => {
    expect(validate(date())('1995-12-17T02:24:00.000Z')).toEqual(
      new Date('Sun Dec 17 1995 03:24:00 GMT+0100 (Central European Standard Time)'),
    );
  });

  it("date validator should not coerce '0' to ISOString", () => {
    expect(() => validate(date())('0')).toThrowError(ValidationError);
  });

  it('date validator should not coerce invalid string', () => {
    expect(() => validate(date())('abc')).toThrowError(ValidationError);
  });

  it('date validator should coerce ISODateString that starts with +/-', () => {
    expect(validate(date())('+010000-01-01T00:00:00.000Z')).toEqual(
      new Date('Sat Jan 01 10000 01:00:00 GMT+0100 (Central European Standard Time)'),
    );
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

  it('should handle more complex case', () => {
    const schema = object({
      name: minLength(4)(string()),
      email: string(),
      firstName: nonEmpty(string()),
      phone: nonEmpty(string()),
      age: number(),
    });
    const validator = validate(schema);

    const obj = {
      name: 'John Doe',
      email: 'john.doe@company.space',
      firstName: 'John',
      phone: '123-4567',
      age: 33,
    };

    expect(() => validator(obj)).not.toThrow();
  });

  it('should throw on unknown keys', () => {
    const validator = validate(
      object({
        a: number(),
        b: string(),
        c: array(string()),
        d: object({ e: string() }),
      }),
    );

    expect(() => validator({ '': [], ' ': [], '!': {}, '"': {} })).toThrowError(ValidationError);
  });
});
