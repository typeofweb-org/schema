import { date, number, string, validate, ValidationError } from '../src';
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

  it('date validator should coerce ISOString to Date', () => {
    expect(validate(date())('1970-01-01T00:00:00.000Z')).toEqual(new Date(0));
  });

  it("date validator should not coerce '0' to ISOString", () => {
    expect(() => validate(date())('0')).toThrowError(ValidationError);
  });

  it('date validator should not coerce invalid string', () => {
    expect(() => validate(date())('abc')).toThrowError(ValidationError);
  });
});
