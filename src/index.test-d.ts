import { expectType } from 'tsd';

import { nullable, optional } from './src/modifiers';
import type { TypeOf, Schema } from './src/types';
import { assert, date, number, oneOf, string } from './src/validators';

// Schema
declare const str1: TypeOf<Schema<string, {}, never>>;
expectType<string>(str1);

declare const str2: TypeOf<Schema<string, { readonly optional: true }, never>>;
expectType<string | undefined>(str2);

declare const str3: TypeOf<Schema<string, { readonly optional: true }, 'a'>>;
expectType<'a' | undefined>(str3);

declare const str4: TypeOf<Schema<string, {}, 'a'>>;
expectType<'a'>(str4);

declare const str5: TypeOf<Schema<string, { readonly nullable: true }, never>>;
expectType<string | null>(str5);

declare const str6: TypeOf<Schema<string, { readonly nullable: true }, 'a'>>;
expectType<'a' | null>(str6);

declare const str7: TypeOf<
  Schema<string, { readonly optional: true; readonly nullable: true }, 'a'>
>;
expectType<'a' | null | undefined>(str7);

declare const str8: TypeOf<
  Schema<string, { readonly optional: true; readonly nullable: true }, never>
>;
expectType<string | null | undefined>(str8);

// validators
const validator1 = string();
expectType<string>(assert(validator1)(''));

const validator2 = number();
expectType<number>(assert(validator2)(''));

const validator3 = date();
expectType<Date>(assert(validator3)(''));

const validator4 = oneOf(['a', 'b'] as const);
expectType<'a' | 'b'>(assert(validator4)(''));

const validator5 = nullable(string());
expectType<string | null>(assert(validator5)(''));

const validator6 = nullable(oneOf(['a'] as const));
expectType<'a' | null>(assert(validator6)(''));

const validator7 = optional(nullable(oneOf(['a'] as const)));
expectType<'a' | null | undefined>(assert(validator7)(''));
