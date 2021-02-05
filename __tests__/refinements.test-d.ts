import { expectType } from 'tsd';

import { optional, string, minLength, validate, pipe, array, nullable, number } from '../src';
import { refine } from '../src/refine';

const allowNull = refine((value, t) => (value === null ? t.right(null) : t.continue));
const x22 = allowNull();
const even = refine((value: number, t) => (value % 2 === 0 ? value : t.left(value)));
const noDuplicateItems = refine((arr: ReadonlyArray<unknown>, t) => {
  const allUnique = arr.every((item, index) => index === arr.indexOf(item));
  return allUnique ? arr : t.left(arr);
});
const noDuplicateItemsAny = refine((arr: ReadonlyArray<any>, t) => {
  const allUnique = arr.every((item, index) => index === arr.indexOf(item));
  return allUnique ? arr : t.left(arr);
});
const allowTimestamps = refine((value, t) =>
  typeof value === 'number' ? new Date(value) : t.continue,
);

const ref1 = validate(optional(allowNull(string())))('');
expectType<string | null | undefined>(ref1);

const ref2 = validate(allowNull(minLength(2)(string())))('');
expectType<string | null>(ref2);

const x = allowNull();
const ref3 = pipe(allowNull, even, validate)(3);
expectType<number>(ref3);

const y = validate(noDuplicateItems());

const uniqueStringArrayValidator = pipe(array(string()), noDuplicateItems, nullable, validate)('');
const uniqueStringArrayValidatorAny = validate(noDuplicateItemsAny(array(string())));
