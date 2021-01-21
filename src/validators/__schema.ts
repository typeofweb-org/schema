import type { SomeSchema, DefaultModifiers } from '../types';

export const TYPEOFWEB_SCHEMA = Symbol('@typeofweb/schema');

export const isSchema = (val: any): val is SomeSchema<any> => {
  return (
    typeof val === 'object' &&
    val !== null &&
    '__validator' in val &&
    '__modifiers' in val &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    val[TYPEOFWEB_SCHEMA] === true
  );
};

export const InitialModifiers: DefaultModifiers = {
  optional: false,
  nullable: false,
  minLength: undefined,
};
