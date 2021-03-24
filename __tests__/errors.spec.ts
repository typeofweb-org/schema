import { number, object, string, validate, date, pipe, ValidationError } from '../src';

const expectToMatchError = (fn: () => any, obj: Record<string, any>) => {
  try {
    fn();
  } catch (err) {
    if (err instanceof ValidationError) {
      return expect(err.details).toStrictEqual(obj);
    }
    fail();
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
        fields: {
          invalidNumber: { expected: 'number', got: 'vvvv' },
          invalidString: { expected: 'string', got: 1333 },
          invalidDate: { expected: 'Date', got: 'no siema eniu' },
        },
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
      fields: {
        nested: { expected: '{ invalid: string }', got: undefined },
      },
    });
  });
});
