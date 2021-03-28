import {
  array,
  number,
  object,
  string,
  validate,
  date,
  pipe,
  ValidationError,
  minStringLength,
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
        tooShortString: minStringLength(10)(),
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

  describe('array', () => {
    it('throws expected error details', () => {
      const validator = validate(array(string())());
      expectToMatchError(() => validator(['test string', 1231]), {
        expected: 'array',
        got: [
          'test string',
          new ValidationError(string(), 1231, {
            _t: 'left',
            value: {
              expected: 'string',
              got: 1231,
            },
          }),
        ],
      });
    });
  });

  // describe('tuple', () => {
  //   it('throws expected error details', () => {
  //     const validator = validate(tuple([string(), number()])());
  //     expectToMatchError(() => validator([1231, 'test string']), {
  //       expected: 'tuple',
  //       got: [
  //         new ValidationError(string(), 1231, {
  //           _t: 'left',
  //           value: {
  //             expected: 'string',
  //             got: 1231,
  //           },
  //         }),
  //         new ValidationError(number(), 'test string', {
  //           _t: 'left',
  //           value: {
  //             expected: 'number',
  //             got: 'test string',
  //           },
  //         }),
  //       ],
  //     });
  //   });
  // });
});
