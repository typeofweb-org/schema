import Fc from 'fast-check';
import { complement, is, lt, prop, __ } from 'ramda';

import { validate, number, string, date, oneOf } from '../src';

const throws = <T extends readonly unknown[]>(predicate: (...args: T) => unknown) => (
  ...args: T
) => {
  try {
    predicate(...args);
    return false;
  } catch {
    return true;
  }
};

const notThrows = <T extends readonly unknown[]>(predicate: (...args: T) => unknown) => (
  ...args: T
) => !throws(predicate)(...args);

describe('@typeofweb/schema', () => {
  describe('string', () => {
    it('should validate strings', () =>
      Fc.assert(Fc.property(Fc.string(), notThrows(validate(string())))));

    it('should not allow other values', () =>
      Fc.assert(
        Fc.property(Fc.anything().filter(complement(is(String))), throws(validate(string()))),
      ));
  });

  describe('number', () => {
    it('should validate numbers', () =>
      Fc.assert(Fc.property(Fc.oneof(Fc.double(), Fc.integer()), notThrows(validate(number())))));

    it('should not allow other values', () =>
      Fc.assert(
        Fc.property(Fc.anything().filter(complement(is(Number))), throws(validate(number()))),
      ));
  });

  describe('date', () => {
    it('should validate dates', () =>
      Fc.assert(Fc.property(Fc.date(), notThrows(validate(date())))));

    it('should not allow other values', () =>
      Fc.assert(Fc.property(Fc.anything().filter(complement(is(Date))), throws(validate(date())))));
  });

  describe('oneOf', () => {
    it('should validate values', () =>
      Fc.assert(
        Fc.property(
          Fc.array(Fc.oneof(Fc.string(), Fc.double(), Fc.integer())).filter(
            (arr) => arr.length > 0,
          ),
          (arr) => notThrows(validate(oneOf(arr)))(arr[0]),
        ),
      ));

    it('should not allow other values', () =>
      Fc.assert(
        Fc.property(
          Fc.set(Fc.oneof(Fc.string(), Fc.double(), Fc.integer())).filter((x) => x.length > 1),
          ([el, ...arr]) => throws(validate(oneOf(arr)))(el),
        ),
      ));
  });
});
