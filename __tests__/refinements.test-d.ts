import { expectType } from 'tsd';

import {
  string,
  validate,
  pipe,
  array,
  number,
  date,
  optional,
  nullable,
  minArrayLength,
  minStringLength,
} from '../src';
import { refine } from '../src/refine';

const nullR = pipe(string, nullable, validate)('');
expectType<string | null>(nullR);

const optionalR = pipe(string, optional, validate)('');
expectType<string | undefined>(optionalR);

const even = refine((value: number, t) => (value % 2 === 0 ? t.next(value) : t.left(value)));
const evenR = pipe(number, even, validate)('');
expectType<number>(evenR);

const noDuplicateItems = refine((arr: ReadonlyArray<unknown>, t) => {
  const allUnique = arr.every((item, index) => index === arr.indexOf(item));
  return allUnique ? t.next(arr) : t.left(arr);
});
const noDuplicateItemsR = pipe(array(string()), noDuplicateItems, validate)('');
expect<readonly string[]>(noDuplicateItemsR);

const noDuplicateItemsAnyR = pipe(array(number()), noDuplicateItems, validate)('');
expect<readonly number[]>(noDuplicateItemsAnyR);

const allowTimestamps = refine((value, t) =>
  typeof value === 'number' ? t.next(new Date(value)) : t.next(value),
);
const allowDateTimestamps = pipe(date, allowTimestamps);
const allowDateTimestampsR = pipe(allowDateTimestamps, validate)('');
expectType<Date>(allowDateTimestampsR);

const ref1 = pipe(string, nullable, optional, validate)('');
expectType<string | null | undefined>(ref1);

const ref2 = pipe(minStringLength(2), nullable, validate)('');
expectType<string | null>(ref2);

const ref3 = pipe(array(string()), minArrayLength(2), nullable, validate)('');
expectType<readonly [string, string, ...(readonly string[])] | null>(ref3);

const ref4 = pipe(number, even, nullable, validate)(1);
expectType<number | null>(ref4);

// @ts-expect-error
pipe(nullable, even, validate)(1);
