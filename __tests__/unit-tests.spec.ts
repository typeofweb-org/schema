import { date, number, string, validate, ValidationError } from '../src';

describe('@typeofweb/schema unit tests', () => {
  it('date validator should not accept invalid date', () => {
    expect(() => validate(date())(new Date(' '))).toThrowError(ValidationError);
  });

  it('string validator should coerce Date to ISOString', () => {
    expect(validate(string())(new Date(0))).toBe('1970-01-01T00:00:00.000Z');
  });

  it('date validator should coerce ISOString to Date', () => {
    expect(validate(date())('1970-01-01T00:00:00.000Z')).toEqual(new Date(0));
  });

  it('number validator should coerce string to number', () => {
    expect(validate(number())('3')).toBe(3);
  });

  it('number validator should not coerce empty string to 0', () => {
    expect(() => validate(number())('')).toThrowError(ValidationError);
  });
});
