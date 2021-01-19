import Fc from 'fast-check';
import { anyPass, complement, is, sort } from 'ramda';

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
  minLength,
  nonEmpty,
  λ,
  pipe,
  unknown,
  tuple,
} from '../src';
import { isISODateString } from '../src/parse';

const shuffle = <T>(arr: readonly T[]) => sort(() => Math.random() - 0.5, arr);

const throws = <T extends readonly unknown[], Err extends Error>(
  predicate: (...args: T) => unknown,
  ErrorClass?: { new (...args: readonly any[]): Err & { readonly message: string } },
  message?: string,
) => (...args: T) => {
  try {
    predicate(...args);
    return false;
  } catch (error: unknown) {
    if (ErrorClass) {
      const isValid = error instanceof ErrorClass && (!message || error.message === message);
      if (!isValid) {
        console.log(error);
      }
      return isValid;
    }
    return true;
  }
};

const isCoercibleToNum = (value: unknown) => !Number.isNaN(Number(value));

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

    it('should not allow invalid strings', () =>
      Fc.assert(
        Fc.property(
          Fc.string().filter(complement(isISODateString)),
          throws(validate(date()), ValidationError),
        ),
      ));

    it('should not allow other values', () =>
      Fc.assert(
        Fc.property(
          Fc.anything().filter(complement(anyPass([is(Date), isISODateString]))),
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

    it('should validate values and validators', () =>
      Fc.assert(
        Fc.property(
          Fc.array(Fc.oneof(Fc.string(), Fc.double(), Fc.integer())).filter(
            (arr) => arr.length > 0,
          ),
          (arr) =>
            notThrows(validate(oneOf(shuffle([...arr, ...primitiveValidators.map((v) => v())]))))(
              shuffle(arr)[0],
            ),
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
                c: array(number(), string(), boolean()),
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
                c: array(string()),
                d: object({ e: string() }),
              }),
            ),
            ValidationError,
          ),
        ),
      ));
  });

  describe('any', () => {
    it('should pass anything', () =>
      Fc.assert(Fc.property(Fc.anything(), notThrows(validate(unknown())))));
  });

  describe('tuple', () => {
    it('should validate tuples', () =>
      Fc.assert(
        Fc.property(Fc.string(), Fc.integer(), (...args) =>
          notThrows(validate(tuple([string(), number()])))(args),
        ),
      ));

    it('should not allow other values', () =>
      Fc.assert(
        Fc.property(
          Fc.anything().filter(complement(is(String))),
          Fc.anything().filter(complement(anyPass([is(Number), isCoercibleToNum]))),
          (...args) => throws(validate(tuple([string(), number()])))(args),
        ),
      ));
  });

  describe('nullable', () => {
    it('should allow null', () =>
      Fc.assert(
        Fc.property(
          Fc.subarray(primitiveValidators, { maxLength: 1, minLength: 1 }),
          ([validator]) => notThrows(validate(nullable(validator!())))(null),
        ),
      ));

    it('should not allow undefined', () =>
      Fc.assert(
        Fc.property(
          Fc.subarray(primitiveValidators, { maxLength: 1, minLength: 1 }),
          ([validator]) => throws(validate(nullable(validator!())), ValidationError)(undefined),
        ),
      ));
  });

  describe('optional', () => {
    it('should allow undefined', () =>
      Fc.assert(
        Fc.property(
          Fc.subarray(primitiveValidators, { maxLength: 1, minLength: 1 }),
          ([validator]) => notThrows(validate(optional(validator!())))(undefined),
        ),
      ));

    it('should not allow null', () =>
      Fc.assert(
        Fc.property(
          Fc.subarray(primitiveValidators, { maxLength: 1, minLength: 1 }),
          ([validator]) => throws(validate(optional(validator!())), ValidationError)(null),
        ),
      ));
  });

  describe('nil', () => {
    it('should allow null or undefined', () =>
      Fc.assert(
        Fc.property(
          Fc.subarray(primitiveValidators, { maxLength: 1, minLength: 1 }),
          Fc.subarray([null, undefined], { maxLength: 1, minLength: 1 }),
          ([validator], [val]) => notThrows(validate(nil(validator!())))(val),
        ),
      ));
  });

  describe('nonEmpty', () => {
    it('should only accept arrays with at least one element', () =>
      Fc.assert(
        Fc.property(
          Fc.array(Fc.oneof(Fc.string(), Fc.integer(), Fc.date(), Fc.boolean())),
          (arr) => {
            const assertion = arr.length > 0 ? notThrows : throws;
            return assertion(validate(nonEmpty(array(...primitiveValidators.map((v) => v())))))(
              arr,
            );
          },
        ),
      ));

    it('should only accept strings at least 1 char long', () =>
      Fc.assert(
        Fc.property(Fc.string(), (str) => {
          const assertion = str.length > 0 ? notThrows : throws;
          return assertion(validate(nonEmpty(string())))(str);
        }),
      ));
  });

  describe('minLength', () => {
    const min = 0;
    const max = 1000;

    it('should only accept arrays with at least X elements', () =>
      Fc.assert(
        Fc.property(
          Fc.array(Fc.oneof(Fc.string(), Fc.integer(), Fc.date(), Fc.boolean()), {
            minLength: min,
            maxLength: max,
          }),
          Fc.integer({ min, max }),
          (arr, length) => {
            const assertion = arr.length >= length ? notThrows : throws;

            return assertion(
              validate(minLength(length)(array(...primitiveValidators.map((v) => v())))),
            )(arr);
          },
        ),
      ));

    it('should only accept strings at least X chars long', () =>
      Fc.assert(
        Fc.property(
          Fc.string({ minLength: min, maxLength: max }),
          Fc.integer({ min, max }),
          (str, length) => {
            const assertion = str.length >= length ? notThrows : throws;
            return assertion(validate(minLength(length)(string())))(str);
          },
        ),
      ));
  });

  describe('λ and pipe', () => {
    it('λ should work with schema factory', () =>
      Fc.assert(
        Fc.property(Fc.oneof(Fc.constant(null), Fc.constant(undefined), Fc.string()), (value) => {
          const assertion =
            typeof value === 'string' ? (value.length > 0 ? notThrows : throws) : notThrows;
          const validator = λ(string, nonEmpty, nullable, optional);
          return assertion(validate(validator))(value);
        }),
      ));

    it('pipe should work with schema', () =>
      Fc.assert(
        Fc.property(Fc.oneof(Fc.constant(null), Fc.constant(undefined), Fc.string()), (value) => {
          const assertion =
            typeof value === 'string' ? (value.length > 0 ? notThrows : throws) : notThrows;
          const validator = pipe(string(), nonEmpty, nullable, optional);
          return assertion(validate(validator))(value);
        }),
      ));
  });
});
