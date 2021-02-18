import { expectType } from 'tsd';

import type {
  If,
  IfAny,
  KeysOfType,
  Optional,
  Required,
  TupleOf,
  UndefinedToOptional,
} from '../src/types';

/**
 * TupleOf
 */
declare const to1: TupleOf<string, 1>;
expectType<readonly [string]>(to1);

declare const to2: TupleOf<string, 10>;
expectType<
  readonly [string, string, string, string, string, string, string, string, string, string]
>(to2);

// @ts-expect-error
declare const _to3: TupleOf<string, 100>;

/**
 * If
 */
declare const if1: If<string, number, true, false>;
expectType<false>(if1);

declare const if2: If<string, number | string, true, false>;
expectType<true>(if2);

declare const if3: If<{ readonly a: 1; readonly b: 2 }, { readonly a: number }, true>;
expectType<true>(if3);

declare const if4: If<{ readonly a: 1; readonly b: 2 }, { readonly c: number }, true>;
expectType<never>(if4);

/**
 * KeysOfType
 */
declare const kot1: KeysOfType<{ readonly a: number; readonly b: string }, string>;
expectType<'b'>(kot1);

declare const kot2: KeysOfType<
  { readonly a: number; readonly b: string; readonly c: string | number },
  string
>;
expectType<'b' | 'c'>(kot2);

declare const kot3: KeysOfType<
  { readonly a: number; readonly b: number; readonly c: object },
  string
>;
expectType<never>(kot3);

/**
 * Optional
 */
declare const opt1: Optional<{ readonly a: string; readonly b: number | undefined }>;
expectType<{ readonly b?: number | undefined }>(opt1);

declare const opt2: Optional<{ readonly a: string; readonly b?: number | undefined }>;
expectType<{ readonly b?: number | undefined }>(opt2);

declare const opt3: Optional<{ readonly a: string; readonly b?: number }>;
expectType<{ readonly b?: number | undefined }>(opt3);

/**
 * Required
 */
declare const req1: Required<{ readonly a: string; readonly b: number | undefined }>;
expectType<{ readonly a: string }>(req1);

declare const req2: Required<{ readonly a: string | undefined; readonly b?: number | undefined }>;
expectType<{}>(req2);

declare const req3: Required<{ readonly a: string; readonly b?: number }>;
expectType<{ readonly a: string }>(req3);

/**
 * UndefinedToOptional
 */
declare const uto1: UndefinedToOptional<{}>;
expectType<{}>(uto1);

declare const uto2: UndefinedToOptional<Date>;
expectType<Date>(uto2);

declare const uto3: UndefinedToOptional<readonly [string, number]>;
expectType<readonly [string, number]>(uto3);

declare const uto4: UndefinedToOptional<readonly string[]>;
expectType<readonly string[]>(uto4);

declare const uto5: UndefinedToOptional<{
  readonly a: string;
  readonly b: number | undefined;
  readonly c?: object;
}>;
expectType<{
  readonly a: string;
  readonly b?: number | undefined;
  readonly c?: object | undefined;
}>(uto5);

/**
 * IfAny
 */
declare const ifany1: IfAny<any, true, false>;
expectType<true>(ifany1);

declare const ifany2: IfAny<unknown, true, false>;
expectType<false>(ifany2);

declare const ifany3: IfAny<unknown, true>;
expectType<unknown>(ifany3);

declare const ifany4: IfAny<unknown | any, true, false>;
expectType<true>(ifany4);
