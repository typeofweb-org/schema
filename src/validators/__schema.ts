import type { SomeSchema, DefaultModifiers } from '../types';

export const isSchema = (val: any): val is SomeSchema<any> => {
  return typeof val === 'object' && val !== null && '__modifiers' in val;
};

export const initialModifiers: DefaultModifiers = {
  optional: false,
  nullable: false,
  minLength: undefined,
};
