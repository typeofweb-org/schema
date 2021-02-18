import { expectType } from 'tsd';

import { string, validate, pipe, array, number, date } from '../src';
import { refine } from '../src/refine';

const allowNull = refine((value, t) => (value === null ? t.right(null) : t.continue(value)));
const nullR = pipe(string, allowNull, validate)('');
expectType<string | null>(nullR);

const optional = refine((value, t) =>
  value === undefined ? t.right(undefined) : t.continue(value),
);
const optionalR = pipe(string, optional, validate)('');
expectType<string | undefined>(optionalR);

const minArrayLength = <L extends number>(minLength: L) =>
  refine((value: readonly unknown[], t) =>
    value.length >= minLength ? t.continue(value as readonly [1]) : t.left(value),
  );
const minStringLength = <L extends number>(minLength: L) =>
  refine((value: string, t) => (value.length >= minLength ? t.continue(value) : t.left(value)));

const even = refine((value: number, t) => (value % 2 === 0 ? t.continue(value) : t.left(value)));
const evenR = pipe(even, validate)('');
expectType<number>(evenR);

const noDuplicateItems = refine((arr: ReadonlyArray<unknown>, t) => {
  const allUnique = arr.every((item, index) => index === arr.indexOf(item));
  return allUnique ? t.continue(arr) : t.left(arr);
});
const noDuplicateItemsR = pipe(array(string()), noDuplicateItems, validate)('');
expect<readonly string[]>(noDuplicateItemsR);

const noDuplicateItemsAnyR = pipe(array(number()), noDuplicateItems, validate)('');
expect<readonly number[]>(noDuplicateItemsAnyR);

const allowTimestamps = refine((value, t) =>
  typeof value === 'number' ? t.continue(new Date(value)) : t.continue(value),
);
const allowDateTimestamps = pipe(date, allowTimestamps);
const allowDateTimestampsR = pipe(allowDateTimestamps, validate)('');
expectType<Date>(allowDateTimestampsR);

const ref1 = pipe(string, allowNull, optional, validate)('');
expectType<string | null | undefined>(ref1);

const ref2 = pipe(minStringLength(2), string, allowNull, validate)('');
expectType<string | null>(ref2);

const ref3 = pipe(minArrayLength(2), array(string()), allowNull, validate)('');
expectType<readonly [string, string, ...(readonly string[])] | null>(ref3);

const ref4 = pipe(number, even, allowNull, validate)(1);
expectType<number | null>(ref4);

// @ts-expect-error
pipe(allowNull, even, validate)(1);
