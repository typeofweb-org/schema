import {
  array,
  number,
  object,
  string,
  validate,
  date,
  tuple,
  pipe,
  ValidationError,
  minStringLength,
  refine,
  nullable,
  optional,
  oneOf,
  λ,
} from '../src';
import type { ErrorData } from '../src/types';

const expectToMatchError = (fn: () => any, details?: ErrorData) => {
  try {
    fn();
  } catch (err) {
    if (err instanceof ValidationError) {
      return expect(err.details).toEqual(details);
    }
    throw err;
  }
  fail();
};

describe('errors', () => {
  it('should list fields in object which are incorrect', () => {
    const validator = pipe(
      object({
        validString: string(),
        invalidNumber: number(),
        validNumber: number(),
        invalidString: string(),
        validDate: date(),
        invalidDate: date(),
      }),
      validate,
    );

    expectToMatchError(
      () =>
        validator({
          validString: 'aaa',
          invalidNumber: 'vvvv',
          validNumber: 123,
          invalidString: 1333,
          validDate: new Date('2020'),
          invalidDate: 'no siema eniu',
        }),
      {
        expected: 'object',
        got: {
          validString: 'aaa',
          invalidNumber: 'vvvv',
          validNumber: 123,
          invalidString: 1333,
          validDate: new Date('2020'),
          invalidDate: 'no siema eniu',
        },
        errors: [
          {
            path: 'invalidNumber',
            error: {
              expected: 'number',
              got: 'vvvv',
            },
          },
          {
            path: 'invalidString',
            error: {
              expected: 'string',
              got: 1333,
            },
          },
          {
            path: 'invalidDate',
            error: { expected: 'date', got: 'no siema eniu' },
          },
        ],
      },
    );
  });

  it('should contain args field', () => {
    const validator = pipe(
      object({
        tooShortString: minStringLength(10)(string()),
      })(),
      validate,
    );
    expectToMatchError(
      () =>
        validator({
          tooShortString: 'too short',
        }),
      {
        expected: 'object',
        got: {
          tooShortString: 'too short',
        },
        errors: [
          {
            path: 'tooShortString',
            error: { expected: 'minStringLength', got: 'too short', args: [10] },
          },
        ],
      },
    );
  });

  it('should list nested objects which are undefined', () => {
    const validator = pipe(
      object({
        invalidNumber: number(),
        nested: object({
          invalidString: string(),
          deeper: object({
            invalidDate: date(),
          })(),
        })(),
      }),
      validate,
    );

    expectToMatchError(
      () =>
        validator({
          nested: {
            deeper: {
              invalidDate: 'I really like this library!',
            },
          },
        }),
      {
        expected: 'object',
        got: { nested: { deeper: { invalidDate: 'I really like this library!' } } },
        errors: [
          {
            path: 'nested',
            error: {
              expected: 'object',
              got: { deeper: { invalidDate: 'I really like this library!' } },
              errors: [
                {
                  path: 'deeper',
                  error: {
                    expected: 'object',
                    got: { invalidDate: 'I really like this library!' },
                    errors: [
                      {
                        path: 'invalidDate',
                        error: { expected: 'date', got: 'I really like this library!' },
                      },
                    ],
                  },
                },
                { path: 'invalidString', error: { expected: 'string', got: undefined } },
              ],
            },
          },
          { path: 'invalidNumber', error: { expected: 'number', got: undefined } },
        ],
      },
    );
  });

  it('should list nested objects which are undefined', () => {
    const validator = pipe(
      object({
        nested: object({
          invalid: string(),
        })(),
      }),
      validate,
    );

    expectToMatchError(() => validator({}), {
      expected: 'object',
      got: {},
      errors: [{ path: 'nested', error: { expected: 'object', got: undefined } }],
    });
  });

  it('should list nested objects which are defined', () => {
    const validator = pipe(
      object({
        a: number(),
        nested: object({
          invalid: string(),
        })(),
      }),
      validate,
    );

    expectToMatchError(() => validator({ a: 123 }), {
      expected: 'object',
      got: { a: 123 },
      errors: [{ path: 'nested', error: { expected: 'object', got: undefined } }],
    });
  });

  it('should use custom refinement to string', () => {
    const email = refine<string, string>(
      (value: string, t) =>
        value.includes('@') ? t.nextValid(value) : t.left({ expected: 'email', got: value }),
      () => 'email',
    );

    const validator = pipe(
      object({
        shouldBeEmail: string(email()),
      }),
      validate,
    );

    expectToMatchError(() => validator({ shouldBeEmail: 123 }), {
      expected: 'object',
      got: { shouldBeEmail: 123 },
      errors: [
        {
          path: 'shouldBeEmail',
          error: {
            expected: 'string',
            got: 123,
          },
        },
      ],
    });

    expectToMatchError(() => validator({ shouldBeEmail: 'notanemail' }), {
      expected: 'object',
      got: { shouldBeEmail: 'notanemail' },
      errors: [
        {
          path: 'shouldBeEmail',
          error: {
            expected: 'email',
            got: 'notanemail',
          },
        },
      ],
    });
  });

  it('nullable', () => {
    expectToMatchError(() => λ(string, nullable, validate)(123), {
      expected: 'string',
      got: 123,
    });
  });

  it('optional', () => {
    expectToMatchError(() => λ(string, optional, validate)(123), {
      expected: 'string',
      got: 123,
    });
  });

  it('even', () => {
    const even = refine((value: number, t) =>
      value % 2 === 0 ? t.nextValid(value) : t.left({ expected: 'even', got: value }),
    );
    expectToMatchError(() => λ(even, number, validate)(1), { expected: 'even', got: 1 });
    expectToMatchError(() => λ(even, number, validate)('dsadsadsa'), {
      expected: 'number',
      got: 'dsadsadsa',
    });
  });

  it('noDuplicateItems', () => {
    const noDuplicateItems = refine((arr: ReadonlyArray<unknown>, t) => {
      const allUnique = arr.every((item, index) => index === arr.indexOf(item));
      return allUnique ? t.nextValid(arr) : t.left({ expected: 'noDuplicateItems', got: arr });
    });
    expectToMatchError(() => λ(noDuplicateItems, array(string()), validate)('siema'), {
      expected: 'array',
      got: 'siema',
    });
    expectToMatchError(() => λ(noDuplicateItems, array(string()), validate)(['a', 'b', 'a']), {
      expected: 'noDuplicateItems',
      got: ['a', 'b', 'a'],
    });
  });

  it('allowTimestamps', () => {
    const allowTimestamps = refine((value, t) =>
      typeof value === 'number' ? t.nextValid(new Date(value)) : t.nextValid(value),
    );
    expectToMatchError(() => λ(date, allowTimestamps, validate)(''), {
      expected: 'date',
      got: '',
    });
  });

  it('presentOrFuture', () => {
    const presentOrFuture = refine((value: Date, t) =>
      value.getTime() >= Date.now()
        ? t.nextValid(value)
        : t.left({ expected: 'presentOrFuture', got: value }),
    );
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 10);
    const pastDate = new Date();
    pastDate.setMonth(futureDate.getMonth() - 10);

    expectToMatchError(() => λ(presentOrFuture, date, validate)(''), {
      expected: 'date',
      got: '',
    });
    expectToMatchError(() => λ(presentOrFuture, date, validate)(pastDate), {
      expected: 'presentOrFuture',
      got: pastDate,
    });
  });

  describe('array', () => {
    it('throws expected error details', () => {
      const validator = validate(array(string())());
      expectToMatchError(() => validator(['test string', 1231]), {
        expected: 'array',
        got: ['test string', 1231],
        errors: [{ path: 1, error: { expected: 'string', got: 1231 } }],
      });
    });
  });

  describe('tuple', () => {
    it('throws expected error details', () => {
      const validator = validate(tuple([oneOf(['some-constant'])(), string(), number()])());
      expectToMatchError(() => validator(['nope', 1231, 'test string']), {
        expected: 'tuple',
        got: ['nope', 1231, 'test string'],
        errors: [
          { path: 0, error: { expected: 'oneOf', got: 'nope' } },
          { path: 1, error: { expected: 'string', got: 1231 } },
          { path: 2, error: { expected: 'number', got: 'test string' } },
        ],
      });
    });
  });
});
