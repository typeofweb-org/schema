import { join } from 'path';

import Fc from 'fast-check';
import { complement, identity, is, lt, prop, __ } from 'ramda';
import tsd from 'tsd';

import { validate, number, string, date, oneOf, object, array, boolean } from '../src';

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
  it('tsd', async () => {
    const diagnostics = await tsd({
      cwd: join(__dirname, '..'),
      typingsFile: './dist/index.d.ts',
      testFiles: ['./__tests__/*.test-d.ts'],
    });

    if (diagnostics.length > 0) {
      const errorMessage = diagnostics.map((test) => {
        return (
          [test.fileName, test.line, test.column].filter(identity).join(':') +
          ` - ${test.severity} - ${test.message}`
        );
      });
      fail('\n' + errorMessage.join('\n') + '\n');
    }
  });

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

  describe('boolean', () => {
    it('should validate booleans', () =>
      Fc.assert(Fc.property(Fc.boolean(), notThrows(validate(boolean())))));

    it('should not allow other values', () =>
      Fc.assert(
        Fc.property(Fc.anything().filter(complement(is(Boolean))), throws(validate(boolean()))),
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

  describe('object', () => {
    it('should validate numbers', () =>
      Fc.assert(
        Fc.property(
          Fc.record({
            a: Fc.integer(),
            b: Fc.string(),
            c: Fc.array(Fc.string()),
            d: Fc.record({
              e: Fc.string(),
            }),
          }),
          notThrows(
            validate(
              object({
                a: number(),
                b: string(),
                c: array([string()]),
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
          ),
        ),
      ));
  });
});
