import { number, object, string, validate, date, pipe, ValidationError, refine } from '../src';
import { modifierToString } from '../src/refine';

const expectToMatchError = (fn: () => any, obj: Record<string, any>) => {
  try {
    fn();
  } catch (err) {
    if (err instanceof ValidationError) {
      return expect(err.getDetails()).toStrictEqual(obj);
    }
    fail(err);
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
        invalidNumber: { expected: 'number', got: 'vvvv' },
        invalidString: { expected: 'string', got: 1333 },
        invalidDate: { expected: 'Date', got: 'no siema eniu' },
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
      nested: { expected: '{ invalid: string }', got: undefined },
    });
  });

  it('should use custom refinement to string', () => {
    const email = refine<string, string>(
      (value: string, t) => (value.includes('@') ? t.nextValid(value) : t.left(value)),
      modifierToString('email'),
    );

    const validator = pipe(
      object({
        // shouldBeEmail: string(email()),
        shouldBeEmail: string(email()),
      }),
      validate,
    );

    expectToMatchError(() => validator({ shouldBeEmail: 123 }), {
      shouldBeEmail: { expected: 'email(string)', got: 123 },
    });
  });
});
