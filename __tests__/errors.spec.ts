import {
  number,
  object,
  string,
  validate,
  date,
  pipe,
  ValidationError,
  minStringLength,
} from '../src';
import type { ErrorDetails } from '../src/errors';

const expectToMatchError = (fn: () => any, details?: ErrorDetails) => {
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
      [
        {
          path: 'invalidNumber',
          expected: 'number',
          got: 'vvvv',
        },
        {
          path: 'invalidString',
          expected: 'string',
          got: 1333,
        },
        {
          path: 'invalidDate',
          expected: 'date',
          got: 'no siema eniu',
        },
      ],
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
      [
        {
          path: 'tooShortString',
          expected: 'minStringLength',
          got: 'too short',
          args: [10],
        },
      ],
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
      [
        {
          path: 'nested.deeper.invalidDate',
          expected: 'date',
          got: 'I really like this library!',
        },
        {
          path: 'nested.invalidString',
          expected: 'string',
          got: undefined,
        },
        {
          path: 'invalidNumber',
          expected: 'number',
          got: undefined,
        },
      ],
    );
  });
});
