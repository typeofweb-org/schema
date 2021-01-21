import type { SomeSchema } from './types';
import type { SIMPLE_VALIDATORS } from './validators/__simpleValidators';
import type { BOOLEAN_VALIDATOR } from './validators/boolean';
import type { DATE_VALIDATOR } from './validators/date';
import type { NUMBER_VALIDATOR } from './validators/number';
import type { ONE_OF_VALIDATOR } from './validators/oneOf';
import type { STRING_VALIDATOR } from './validators/string';
import type { TUPLE_VALIDATOR } from './validators/tuple';
import type { UNKNOWN_VALIDATOR } from './validators/unknown';

export type SIMPLE_VALIDATORS = typeof SIMPLE_VALIDATORS[number];
export type AllValidators =
  | ONE_OF_VALIDATOR
  | SIMPLE_VALIDATORS
  | TUPLE_VALIDATOR
  | Record<string, SomeSchema<any>>
  | readonly SomeSchema<any>[];

export interface SimpleValidatorToType {
  readonly [STRING_VALIDATOR]: string;
  readonly [NUMBER_VALIDATOR]: number;
  readonly [DATE_VALIDATOR]: Date;
  readonly [BOOLEAN_VALIDATOR]: boolean;
  readonly [UNKNOWN_VALIDATOR]: unknown;
}
