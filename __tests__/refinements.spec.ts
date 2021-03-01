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
  λ,
} from '../src';

describe('refinements', () => {
  const even = refine((value: number, t) => (value % 2 === 0 ? t.next(value) : t.left(value)));

  const noDuplicateItems = refine((arr: ReadonlyArray<unknown>, t) => {
    const allUnique = arr.every((item, index) => index === arr.indexOf(item));
    return allUnique ? t.next(arr) : t.left(arr);
  });

  const allowTimestamps = refine((value, t) =>
    typeof value === 'number' ? t.next(new Date(value)) : t.next(value),
  );

  const presentOrFuture = refine((value: Date, t) =>
    value.getTime() >= Date.now() ? t.next(value) : t.left(value),
  );

  it('nullable', () => {
    expect(λ(string, nullable, validate)(null)).toEqual(null);
    expect(λ(string, nullable, validate)('siema')).toEqual('siema');
    expect(() => λ(string, nullable, validate)(123)).toThrow();
  });

  it('optional', () => {
    expect(λ(string, optional, validate)(undefined)).toEqual(undefined);
    expect(λ(string, optional, validate)('siema')).toEqual('siema');
    expect(() => λ(string, optional, validate)(123)).toThrow();
  });

  it('even', () => {
    expect(λ(number, even, validate)(2)).toEqual(2);
    expect(() => λ(number, even, validate)(1)).toThrow();
    expect(() => λ(number, even, validate)('dsadsadsa')).toThrow();
  });

  it('noDuplicateItems', () => {
    expect(λ(array(string()), noDuplicateItems, validate)(['siema'])).toEqual(['siema']);
    expect(() => λ(array(string()), noDuplicateItems, validate)('siema')).toThrow();
    expect(() => λ(array(string()), noDuplicateItems, validate)(['a', 'b', 'a'])).toThrow();
  });

  it('allowTimestamps', () => {
    expect(() => λ(date, allowTimestamps, validate)('')).toThrow();
    expect(λ(date, allowTimestamps, validate)(new Date(123123123))).toEqual(new Date(123123123));
    expect(λ(date, allowTimestamps, validate)(123123123)).toEqual(new Date(123123123));
  });

  it('presentOrFuture', () => {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);
    const pastDate = new Date();
    pastDate.setMonth(futureDate.getMonth() - 1);

    expect(λ(presentOrFuture, date, validate)(futureDate)).toEqual(futureDate);
    expect(() => λ(presentOrFuture, date, validate)('')).toThrow();
    expect(() => λ(presentOrFuture, date, validate)(pastDate)).toThrow();
  });

  it('', () => {
    expect(λ(string, nullable, optional, validate)(null)).toEqual(null);
    expect(λ(string, nullable, optional, validate)(undefined)).toEqual(undefined);
    expect(λ(string, nullable, optional, validate)('adsadsad')).toEqual('adsadsad');
    expect(() => λ(string, nullable, optional, validate)(12312312)).toThrow();

    expect(λ(minStringLength(2), nullable, validate)('ab')).toEqual('ab');
    expect(() => λ(minStringLength(2), nullable, validate)('a')).toThrow();
    expect(() => λ(minStringLength(2), nullable, validate)(1)).toThrow();
    expect(() => λ(minStringLength(2), nullable, validate)(11231231)).toThrow();

    expect(λ(array(string()), minArrayLength(2), nullable, validate)(['a', 'b'])).toEqual([
      'a',
      'b',
    ]);
    expect(() => λ(array(string()), minArrayLength(2), nullable, validate)([])).toThrow();
    expect(() => λ(array(string()), minArrayLength(2), nullable, validate)([1, 2, 3])).toThrow();
    expect(() => λ(array(string()), minArrayLength(2), nullable, validate)([1, 'b'])).toThrow();
    expect(() => λ(array(string()), minArrayLength(2), nullable, validate)([1, 2])).toThrow();

    expect(λ(number, even, nullable, validate)(2)).toEqual(2);
    expect(λ(number, even, nullable, validate)(null)).toEqual(null);
    expect(() => λ(number, even, nullable, validate)(1)).toThrow();
    expect(() => λ(number, even, nullable, validate)('adsadsadsa')).toThrow();
  });
});
