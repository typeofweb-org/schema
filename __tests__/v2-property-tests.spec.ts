import Fc from 'fast-check';
import { anyPass, complement, is, sort } from 'ramda';

import { ValidationError } from '../src';
import { isISODateString } from '../src/parse';
import type { Either } from '../src/types';
import { validate } from '../src/validators/__validate';
import { array } from '../src/validators/array';
import { boolean } from '../src/validators/boolean';
import { date } from '../src/validators/date';
import { number } from '../src/validators/number';
import { object } from '../src/validators/object';
import { oneOf } from '../src/validators/oneOf';
import { string } from '../src/validators/string';
import { tuple } from '../src/validators/tuple';
import { unknown } from '../src/validators/unknown';

const shuffle = <T>(arr: readonly T[]) => sort(() => Math.random() - 0.5, arr);

const throws = <T extends readonly unknown[], Err extends Error>(
  predicate: (...args: T) => Either<any>,
  ErrorClass?: { new (...args: readonly any[]): Err & { readonly message: string } },
  message?: string,
) => (...args: T) => {
  const result = predicate(...args);
  if (result._t === 'right') {
    // console.log(result);
    return false;
  }

  const error = result.value;
  // if (ErrorClass) {
  //   const isValid = error instanceof ErrorClass && (!message || error.message === message);
  //   if (!isValid) {
  //     console.log(error);
  //   }
  //   console.log({ isValid });
  //   return isValid;
  // }
  return true;
};

const isCoercibleToNum = (value: unknown) => !Number.isNaN(Number(value));

const notThrows = <T extends readonly unknown[]>(predicate: (...args: T) => Either<any>) => (
  ...args: T
) => !throws(predicate)(...args);

const primitiveValidators = [number, string, date, boolean];

describe('v2 validators', () => {
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
});
