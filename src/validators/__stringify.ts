declare global {
  interface Array<T> {
    includes(searchElement: unknown, fromIndex?: number): searchElement is T;
  }

  interface ReadonlyArray<T> {
    includes(searchElement: unknown, fromIndex?: number): searchElement is T;
  }
}

import type { SomeSchema } from '../types';

import { getModifiers, unionToPrint } from './__stringifyHelpers';

export const schemaToString = (schema: SomeSchema<any>): string => {
  const modifiers = getModifiers(schema);
  return unionToPrint([schema.toString(), ...modifiers]);
};
