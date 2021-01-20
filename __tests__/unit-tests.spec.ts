import type { AnySchema, SomeSchema } from '../src';
import {
  unknown,
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
} from '../src';
import { schemaToString, ValidationError } from '../src/errors';
import { isISODateString } from '../src/parse';
import {
  isArraySchema,
  isLiteralSchema,
  isRecordSchema,
  isSimpleSchema,
  tuple,
} from '../src/validators';

describe('@typeofweb/schema unit tests', () => {
  const simpleValidators: ReadonlyArray<() => AnySchema> = [boolean, date, number, string];
  const objectValidator = () => object({});
  const arrayValidator = () => array(string());
  const literalValidator = () => oneOf(['a']);
  const allValidators = [...simpleValidators, objectValidator, arrayValidator, literalValidator];
  const modifiers: ReadonlyArray<
    { bivarianceHack(schema: SomeSchema<any>): SomeSchema<any> }['bivarianceHack']
  > = [minLength(35), nil, nonEmpty, nullable, optional];

  describe('validation', () => {
    it('string validator should coerce Date to ISOString', () => {
      expect(validate(string())(new Date(0))).toBe('1970-01-01T00:00:00.000Z');
    });

    it('number validator should coerce string to number', () => {
      expect(validate(number())('3')).toBe(3);
    });

    it('number validator should not coerce empty string to 0', () => {
      expect(() => validate(number())('')).toThrowErrorMatchingInlineSnapshot(
        `"Invalid type! Expected ≫number≪ but got \\"\\"!"`,
      );
    });

    it("isISODateString should return false for '0'", () => {
      expect(isISODateString('0')).toBe(false);
    });

    it('date validator should not accept invalid date', () => {
      expect(() => validate(date())(new Date(' '))).toThrowErrorMatchingInlineSnapshot(
        `"Invalid type! Expected ≫Date≪ but got null!"`,
      );
    });

    it('date validator should not accept invalid ISODateString', () => {
      expect(() =>
        validate(date())('123456789123456789123456789'),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Invalid type! Expected ≫Date≪ but got \\"123456789123456789123456789\\"!"`,
      );
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
      expect(() => validate(date())('0')).toThrowErrorMatchingInlineSnapshot(
        `"Invalid type! Expected ≫Date≪ but got \\"0\\"!"`,
      );
    });

    it('date validator should not coerce invalid string', () => {
      expect(() => validate(date())('abc')).toThrowErrorMatchingInlineSnapshot(
        `"Invalid type! Expected ≫Date≪ but got \\"abc\\"!"`,
      );
    });

    it('date validator should coerce ISODateString that starts with +/-', () => {
      expect(validate(date())('+010000-01-01T00:00:00.000Z')).toEqual(
        new Date('Sat Jan 01 10000 01:00:00 GMT+0100 (Central European Standard Time)'),
      );
    });

    it('should allow optional fields', () => {
      const personSchema = object({
        name: string(),
        age: number(),
        email: optional(string()),
      });

      expect(
        validate(personSchema)({
          name: 'Mark',
          age: 29,
        }),
      ).toEqual({
        name: 'Mark',
        age: 29,
      });

      expect(
        validate(personSchema)({
          name: 'Mark',
          age: 29,
          email: undefined,
        }),
      ).toEqual({
        name: 'Mark',
        age: 29,
      });

      expect(
        validate(personSchema)({
          name: 'Mark',
          age: 29,
          email: 'email',
        }),
      ).toEqual({
        name: 'Mark',
        age: 29,
        email: 'email',
      });

      expect(() =>
        validate(personSchema)({
          name: 'Mark',
          age: 29,
          email: 123123123,
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Invalid type! Expected (≫string≪ | undefined) but got 123123123!"`,
      );
    });

    it('should not allow optional fields be passed instead of required', () => {
      const user = object({
        name: string(),
        age: optional(number()),
      });
      expect(() => validate(user)({ age: 23 })).toThrowError(ValidationError);
    });

    it('should detect schemas', () => {
      expect.assertions(allValidators.length * (modifiers.length + 1));

      allValidators.forEach((v) => {
        expect(isSchema(v())).toBe(true);
        modifiers.forEach((m) => {
          expect(isSchema(m(v()))).toBe(true);
        });
      });
    });

    it('should detect specific schemas', () => {
      const testCases: readonly {
        readonly fn: (s: SomeSchema<any>) => boolean;
        readonly shouldDetect: ReadonlyArray<() => SomeSchema<any>>;
      }[] = [
        { fn: isSimpleSchema, shouldDetect: simpleValidators },
        { fn: isLiteralSchema, shouldDetect: [literalValidator] },
        { fn: isArraySchema, shouldDetect: [arrayValidator] },
        { fn: isRecordSchema, shouldDetect: [objectValidator] },
      ];

      expect.assertions((modifiers.length + 1) * allValidators.length * testCases.length);

      testCases.forEach(({ fn, shouldDetect }) => {
        const correct = shouldDetect;
        const incorrect = allValidators.filter((v) => !correct.includes(v));

        correct.forEach((v) => {
          expect(fn(v())).toBe(true);
          modifiers.forEach((m) => {
            expect(fn(m(v()))).toBe(true);
          });
        });
        incorrect.forEach((v) => {
          expect(fn(v())).toBe(false);
          modifiers.forEach((m) => {
            expect(fn(m(v()))).toBe(false);
          });
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

    it('unknown() should allow missing keys in objecy', () => {
      const schema = object({
        name: minLength(4)(string()),
        email: unknown(),
      });
      const validator = validate(schema);

      const obj = {
        name: 'John Doe',
      };

      expect(() => validator(obj)).not.toThrow();
    });

    it('tuple should validate given items in given order', () => {
      const schema = object({
        a: tuple([]),
        b: tuple([1, 2, 3]),
        c: tuple([number(), string()]),
        d: nullable(tuple([string()])),
      });
      const validator = validate(schema);

      const obj = {
        a: [],
        b: [1, 2, 3],
        c: [241231, 'aaaa'],
        d: null,
      };

      expect(() => validator(obj)).not.toThrow();
    });

    it('tuple should throw on invalid values', () => {
      const validator1 = validate(tuple([]));
      const validator2 = validate(tuple([1, 2, 3]));
      const validator3 = validate(tuple([number(), string()]));
      const validator4 = validate(tuple([1, 2, 3, number(), string()]));

      expect(() => validator1([1, 2, 3])).toThrow();
      expect(() => validator2([1, 3, 2])).toThrow();
      expect(() => validator3('hello')).toThrow();
      expect(() => validator4([1, 2, 3, 42, null])).toThrow();
    });

    it('object should throw on unknown keys', () => {
      const validator = validate(
        object({
          a: number(),
          b: string(),
          c: array(string()),
          d: object({ e: string(), f: oneOf([string(), false]) }),
        }),
      );

      expect(() =>
        validator({ '': [], ' ': [], '!': {}, '"': {} }),
      ).toThrowErrorMatchingInlineSnapshot(`"Invalid type! Expected ≫number≪ but got undefined!"`);
    });

    it('should throw on when array was expected but not given', () => {
      const validator = validate(array(string()));
      expect(() => validator(42)).toThrowErrorMatchingInlineSnapshot(
        `"Invalid type! Expected ≫string[]≪ but got 42!"`,
      );
    });

    it('should throw on invalid values in arrays', () => {
      const validator = validate(array(object({ a: string() })));
      expect(() => validator([123])).toThrowErrorMatchingInlineSnapshot(
        `"Invalid type! Expected ≫{ a: ≫string≪ }[]≪ but got [123]!"`,
      );
    });

    it('should throw when deeply nested object fails', () => {
      const validator = validate(
        object({
          a: number(),
          b: object({
            c: string(),
            d: object({
              e: array(
                object({
                  f: string(),
                }),
              ),
            }),
          }),
        }),
      );

      expect(() =>
        validator({
          a: 1,
          b: {
            c: 'aaa',
            d: {
              e: [
                {
                  f: 'bbb',
                },
                {
                  f: 123, // fails
                },
              ],
            },
          },
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Invalid type! Expected ≫{ f: ≫string≪ }[]≪ but got [{\\"f\\":\\"bbb\\"},{\\"f\\":123}]!"`,
      );
    });
  });

  describe('schemaToString', () => {
    it('should work for simple validators', () => {
      expect(schemaToString(string())).toEqual('≫string≪');
      expect(schemaToString(number())).toEqual('≫number≪');
      expect(schemaToString(boolean())).toEqual('≫boolean≪');
      expect(schemaToString(date())).toEqual('≫Date≪');
      expect(schemaToString(unknown())).toEqual('≫unknown≪');
    });

    it('should work for oneOf', () => {
      expect(schemaToString(oneOf([1]))).toEqual('1');
      expect(schemaToString(oneOf([string()]))).toEqual('≫string≪');
      expect(schemaToString(oneOf([1, 2, 3]))).toEqual('(1 | 2 | 3)');
      expect(schemaToString(oneOf(['a', 'b', 'c']))).toEqual('("a" | "b" | "c")');
      expect(schemaToString(oneOf(['a', 'b', 12, 'c']))).toEqual('("a" | "b" | 12 | "c")');
      expect(schemaToString(oneOf([1, 2, string(), 3, boolean()]))).toEqual(
        '(1 | 2 | ≫string≪ | 3 | ≫boolean≪)',
      );
    });

    it('should work for arrays', () => {
      expect(schemaToString(array(number()))).toEqual('≫number[]≪');
      expect(schemaToString(array(string()))).toEqual('≫string[]≪');
      expect(schemaToString(array(string(), boolean()))).toEqual('≫(string | boolean)[]≪');
    });

    it('should work for objects', () => {
      expect(schemaToString(object({}))).toEqual('{}');
      expect(schemaToString(object({ a: string() }))).toEqual('{ a: ≫string≪ }');
      expect(
        schemaToString(object({ a: string(), b: number(), 'no elo koleś': boolean() })),
      ).toEqual('{ a: ≫string≪, b: ≫number≪, "no elo koleś": ≫boolean≪ }');
    });

    it('should work for tuples', () => {
      expect(schemaToString(tuple(['a', string(), number()]))).toEqual('["a", ≫string≪, ≫number≪]');
      expect(schemaToString(tuple(['a']))).toEqual('["a"]');
      expect(schemaToString(tuple([number(), oneOf(['s', 'm', 'h'])]))).toEqual(
        '[≫number≪, ("s" | "m" | "h")]',
      );
      expect(schemaToString(tuple([number(), tuple([string(), oneOf(['s', 'm', 'h'])])]))).toEqual(
        '[≫number≪, [≫string≪, ("s" | "m" | "h")]]',
      );
    });

    it('should work for deeply nested objects', () => {
      expect(
        schemaToString(
          object({
            a: string(),
            b: number(),
            'no elo koleś': boolean(),
            c: object({ e: array(oneOf([array(string()), object({ xxx: number() })])) }),
          }),
        ),
      ).toEqual(
        '{ a: ≫string≪, b: ≫number≪, "no elo koleś": ≫boolean≪, c: { e: ≫(≫string[]≪ | { xxx: ≫number≪ })[]≪ } }',
      );
    });

    it('should work for simple validators with modifiers', () => {
      expect(schemaToString(optional(string()))).toEqual('(≫string≪ | undefined)');
      expect(schemaToString(nullable(string()))).toEqual('(≫string≪ | null)');
      expect(schemaToString(optional(number()))).toEqual('(≫number≪ | undefined)');
      expect(schemaToString(nullable(number()))).toEqual('(≫number≪ | null)');
      expect(schemaToString(optional(boolean()))).toEqual('(≫boolean≪ | undefined)');
      expect(schemaToString(nullable(boolean()))).toEqual('(≫boolean≪ | null)');
      expect(schemaToString(optional(date()))).toEqual('(≫Date≪ | undefined)');
      expect(schemaToString(nullable(date()))).toEqual('(≫Date≪ | null)');
    });

    it('should work for oneOf with modifiers', () => {
      expect(schemaToString(optional(oneOf([1])))).toEqual('(1 | undefined)');
      expect(schemaToString(nullable(oneOf([string()])))).toEqual('(≫string≪ | null)');
      expect(schemaToString(nullable(oneOf([1, 2, 3])))).toEqual('(1 | 2 | 3 | null)');
      expect(schemaToString(oneOf([1, 2, optional(string()), 3, boolean()]))).toEqual(
        '(1 | 2 | (≫string≪ | undefined) | 3 | ≫boolean≪)',
      );
    });

    it('should work for arrays with modifiers', () => {
      expect(schemaToString(array(number()))).toEqual('≫number[]≪');
      expect(schemaToString(array(string()))).toEqual('≫string[]≪');
      expect(schemaToString(array(string(), boolean()))).toEqual('≫(string | boolean)[]≪');
    });

    it('should work for objects with modifiers', () => {
      expect(schemaToString(optional(object({})))).toEqual('({} | undefined)');
      expect(schemaToString(nullable(object({ a: string() })))).toEqual('({ a: ≫string≪ } | null)');
      expect(
        schemaToString(nil(object({ a: string(), b: number(), 'no elo koleś': boolean() }))),
      ).toEqual('({ a: ≫string≪, b: ≫number≪, "no elo koleś": ≫boolean≪ } | undefined | null)');
    });

    it('should work for deeply nested objects with modifiers', () => {
      expect(
        schemaToString(
          object({
            a: optional(string()),
            b: number(),
            'no elo koleś': boolean(),
            c: object({
              e: nullable(array(oneOf([optional(array(string())), object({ xxx: number() })]))),
            }),
          }),
        ),
      ).toEqual(
        '{ a: (≫string≪ | undefined), b: ≫number≪, "no elo koleś": ≫boolean≪, c: { e: (≫((≫string[]≪ | undefined) | { xxx: ≫number≪ })[]≪ | null) } }',
      );
    });
  });
});
