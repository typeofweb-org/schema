import type { SomeSchema } from './types';

export const isSchema = (val: any): val is SomeSchema<any> => {
  return typeof val === 'object' && val !== null && '__modifiers' in val;
};
