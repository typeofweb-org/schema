import Fc from 'fast-check';
import { anyPass, complement, construct, curry, is, not, or, pipe } from 'ramda';

import {
  validate,
  number,
  string,
  date,
  oneOf,
  object,
  array,
  boolean,
  nullable,
  optional,
  nil,
  ValidationError,
} from '../src';

const throws = <T extends readonly unknown[], Err extends Error>(
  predicate: (...args: T) => unknown,
  ErrorClass?: { new (): Err },
) => (...args: T) => {
  try {
    predicate(...args);
    return false;
  } catch (error) {
    if (ErrorClass) {
      return error instanceof ErrorClass;
    }
    return true;
  }
};

const isCoercibleToNum = (value: unknown) => Boolean(Number(value));
const isISOString = (value: unknown) =>
  pipe(construct(Date), Number, Number.isNaN, not)(value as string);

const notThrows = <T extends readonly unknown[]>(predicate: (...args: T) => unknown) => (
  ...args: T
) => !throws(predicate)(...args);

const primitiveValidators = [number, string, date, boolean];

describe('@typeofweb/schema', () => {
  describe('string', () => {
    it('should validate strings', () =>
      Fc.assert(Fc.property(Fc.string(), notThrows(validate(string())))));

    it('should validate `Date` instances', () => {
      Fc.assert(Fc.property(Fc.date(), notThrows(validate(string()))));
    });

    it('should not allow other values', () =>
      Fc.assert(
        Fc.property(
          Fc.anything().filter(complement(anyPass([is(String), is(Date)]))),
          throws(validate(string()), ValidationError),
        ),
      ));
  });

  describe('number', () => {
    it('should validate numbers', () =>
      Fc.assert(Fc.property(Fc.oneof(Fc.double(), Fc.integer()), notThrows(validate(number())))));

    it('should validate strings that can be coerced to number', () =>
      Fc.assert(
        Fc.property(
          Fc.oneof(Fc.double(), Fc.integer()).map((number) => String(number)),
          notThrows(validate(number())),
        ),
      ));

    it('should not allow other values', () =>
      Fc.assert(
        Fc.property(
          Fc.anything().filter(complement(anyPass([is(Number), isCoercibleToNum]))),
          throws(validate(number()), ValidationError),
        ),
      ));
  });

  describe('boolean', () => {
    it('should validate booleans', () =>
      Fc.assert(Fc.property(Fc.boolean(), notThrows(validate(boolean())))));

    it('should not allow other values', () =>
      Fc.assert(
        Fc.property(
          Fc.anything().filter(complement(is(Boolean))),
          throws(validate(boolean()), ValidationError),
        ),
      ));
  });

  describe('date', () => {
    it('should validate dates', () =>
      Fc.assert(Fc.property(Fc.date(), notThrows(validate(date())))));

    it('should validate ISOStrings', () =>
      Fc.assert(
        Fc.property(
          Fc.date().map((date) => date.toISOString()),
          notThrows(validate(date())),
        ),
      ));

    it('should not allow other values', () =>
      Fc.assert(
        Fc.property(
          Fc.anything().filter(complement(anyPass([is(Date), isISOString]))),
          throws(validate(date()), ValidationError),
        ),
      ));
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
          ([el, ...arr]) => throws(validate(oneOf(arr)), ValidationError)(el),
        ),
      ));
  });

  describe('object', () => {
    it('should validate numbers', () =>
      Fc.assert(
        Fc.property(
          Fc.record({
            a: Fc.integer(),
            b: Fc.string(),
            c: Fc.array(Fc.oneof(Fc.string(), Fc.integer(), Fc.boolean())),
            d: Fc.record({
              e: Fc.string(),
            }),
          }),
          notThrows(
            validate(
              object({
                a: number(),
                b: string(),
                c: array([number(), string(), boolean()]),
                d: object({ e: string() }),
              }),
            ),
          ),
        ),
      ));

    it('should not allow other values', () =>
      Fc.assert(
        Fc.property(
          Fc.anything(),
          throws(
            validate(
              object({
                a: number(),
                b: string(),
                c: array([string()]),
                d: object({ e: string() }),
              }),
            ),
            ValidationError,
          ),
        ),
      ));
  });

  describe('nullable', () => {
    it('should allow null', () =>
      Fc.assert(
        Fc.property(
          Fc.subarray(primitiveValidators, { maxLength: 1, minLength: 1 }),
          ([validator]) => notThrows(validate(nullable(validator())))(null),
        ),
      ));

    it('should not allow undefined', () =>
      Fc.assert(
        Fc.property(
          Fc.subarray(primitiveValidators, { maxLength: 1, minLength: 1 }),
          ([validator]) => throws(validate(nullable(validator())), ValidationError)(undefined),
        ),
      ));
  });

  describe('optional', () => {
    it('should allow undefined', () =>
      Fc.assert(
        Fc.property(
          Fc.subarray(primitiveValidators, { maxLength: 1, minLength: 1 }),
          ([validator]) => notThrows(validate(optional(validator())))(undefined),
        ),
      ));

    it('should not allow null', () =>
      Fc.assert(
        Fc.property(
          Fc.subarray(primitiveValidators, { maxLength: 1, minLength: 1 }),
          ([validator]) => throws(validate(optional(validator())), ValidationError)(null),
        ),
      ));
  });

  describe('nil', () => {
    it('should allow null or undefined', () =>
      Fc.assert(
        Fc.property(
          Fc.subarray(primitiveValidators, { maxLength: 1, minLength: 1 }),
          Fc.subarray([null, undefined], { maxLength: 1, minLength: 1 }),
          ([validator], [val]) => notThrows(validate(nil(validator())))(val),
        ),
      ));
  });
});
