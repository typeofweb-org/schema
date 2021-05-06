import {
  array,
  date,
  minArrayLength,
  minStringLength,
  nullable,
  number,
  optional,
  refine,
  string,
  validate,
  ValidationError,
  λ,
} from '../src';

describe('refinements', () => {
  const even = refine((value: number, t) =>
    value % 2 === 0 ? t.nextValid(value) : t.left({ expected: 'even', got: value }),
  );

  const noDuplicateItems = refine((arr: ReadonlyArray<unknown>, t) => {
    const allUnique = arr.every((item, index) => index === arr.indexOf(item));
    return allUnique ? t.nextValid(arr) : t.left({ expected: 'noDuplicateItems', got: arr });
  });

  const allowTimestamps = refine((value, t) =>
    typeof value === 'number' ? t.nextValid(new Date(value)) : t.nextValid(value),
  );

  const presentOrFuture = refine((value: Date, t) =>
    value.getTime() >= Date.now()
      ? t.nextValid(value)
      : t.left({ expected: 'presentOrFuture', got: value }),
  );

  it('nullable', () => {
    expect(λ(string, nullable, validate)(null)).toEqual(null);
    expect(λ(string, nullable, validate)('siema')).toEqual('siema');
    expect(() => λ(string, nullable, validate)(123)).toThrow(ValidationError);
  });

  it('optional', () => {
    expect(λ(string, optional, validate)(undefined)).toEqual(undefined);
    expect(λ(string, optional, validate)('siema')).toEqual('siema');
    expect(() => λ(string, optional, validate)(123)).toThrow(ValidationError);
  });

  it.only('even', () => {
    expect(λ(even, number, validate)(2)).toEqual(2);
    expect(() => λ(even, number, validate)(1)).toThrow(ValidationError);
    expect(() => λ(even, number, validate)('dsadsadsa')).toThrow(ValidationError);
  });

  it.only('noDuplicateItems', () => {
    expect(λ(noDuplicateItems, array(string()), validate)(['siema'])).toEqual(['siema']);
    expect(() => λ(noDuplicateItems, array(string()), validate)('siema')).toThrow(ValidationError);
    expect(() => λ(noDuplicateItems, array(string()), validate)(['a', 'b', 'a'])).toThrow(
      ValidationError,
    );
  });

  it.only('allowTimestamps', () => {
    expect(() => λ(date, allowTimestamps, validate)('')).toThrow(ValidationError);
    expect(λ(date, allowTimestamps, validate)(new Date(123123123))).toEqual(new Date(123123123));
    expect(λ(date, allowTimestamps, validate)(123123123)).toEqual(new Date(123123123));
  });

  it('presentOrFuture', () => {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 10);
    const pastDate = new Date();
    pastDate.setMonth(futureDate.getMonth() - 10);

    expect(λ(presentOrFuture, date, validate)(futureDate)).toEqual(futureDate);
    expect(() => λ(presentOrFuture, date, validate)('')).toThrow(ValidationError);
    expect(() => λ(presentOrFuture, date, validate)(pastDate)).toThrow(ValidationError);
  });

  it.only('a', () => {
    expect(λ(string, nullable, optional, validate)(null)).toEqual(null);
    expect(λ(string, nullable, optional, validate)(undefined)).toEqual(undefined);
    expect(λ(string, nullable, optional, validate)('adsadsad')).toEqual('adsadsad');
    expect(() => λ(string, nullable, optional, validate)(12312312)).toThrow(ValidationError);

    expect(λ(minStringLength(2), string, nullable, validate)('ab')).toEqual('ab');
    expect(() => λ(minStringLength(2), string, nullable, validate)('a')).toThrow(ValidationError);
    expect(() => λ(minStringLength(2), string, nullable, validate)(1)).toThrow(ValidationError);
    expect(() => λ(minStringLength(2), string, nullable, validate)(11231231)).toThrow(
      ValidationError,
    );

    expect(λ(minArrayLength(2), array(string()), nullable, validate)(['a', 'b'])).toEqual([
      'a',
      'b',
    ]);
    expect(() => λ(minArrayLength(2), array(string()), validate)(123)).toThrow(ValidationError);
    expect(() => λ(minArrayLength(2), array(string()), nullable, validate)([])).toThrow(
      ValidationError,
    );
    expect(() => λ(minArrayLength(2), array(string()), nullable, validate)([1, 2, 3])).toThrow(
      ValidationError,
    );
    expect(() => λ(minArrayLength(2), array(string()), nullable, validate)([1, 'b'])).toThrow(
      ValidationError,
    );
    expect(() => λ(minArrayLength(2), array(string()), nullable, validate)([1, 2])).toThrow(
      ValidationError,
    );

    expect(λ(even, number, nullable, validate)(2)).toEqual(2);
    expect(λ(even, number, nullable, validate)(null)).toEqual(null);
    expect(() => λ(even, number, nullable, validate)(1)).toThrow(ValidationError);
    expect(() => λ(even, number, nullable, validate)('adsadsadsa')).toThrow(ValidationError);
  });
});
