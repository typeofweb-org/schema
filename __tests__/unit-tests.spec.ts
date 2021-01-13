import { date, validate, ValidationError } from '../src';

describe('@typeofweb/schema unit tests', () => {
  it('date validator should not accept invalid date', () => {
    expect(() => validate(date())(new Date(' '))).toThrowError(ValidationError);
  });
});
