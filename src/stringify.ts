import type { SomeSchema } from './types';

export const schemaToString = (schema: SomeSchema<any>): string => {
  return schema.toString();
};

export const typeToPrint = (str: string) => str;
export const objectToPrint = (str: string) => '{' + str + '}';
export const quote = (str: string) => (/\s/.test(str) ? `"${str}"` : str);

export const unionToPrint = (arr: readonly string[]): string => {
  const str = arr.join(' | ');

  if (arr.length > 1) {
    return `(${str})`;
  }
  return str;
};

declare global {
  interface Array<T> {
    includes(searchElement: unknown, fromIndex?: number): searchElement is T;
  }

  interface ReadonlyArray<T> {
    includes(searchElement: unknown, fromIndex?: number): searchElement is T;
  }
}
