import type { SimpleSchema, SomeSchema } from '../types';

import { BOOLEAN_VALIDATOR } from './boolean';
import { DATE_VALIDATOR } from './date';
import { NUMBER_VALIDATOR } from './number';
import { STRING_VALIDATOR } from './string';
import { UNKNOWN_VALIDATOR } from './unknown';

export const SIMPLE_VALIDATORS = [
  STRING_VALIDATOR,
  NUMBER_VALIDATOR,
  BOOLEAN_VALIDATOR,
  DATE_VALIDATOR,
  UNKNOWN_VALIDATOR,
] as const;

export const isSimpleSchema = (s: SomeSchema<any>): s is SimpleSchema =>
  SIMPLE_VALIDATORS.includes(s.__validator);
