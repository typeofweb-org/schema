import type { SomeSchema } from './types';

export const schemaToString = (schema?: SomeSchema<any>): string => {
  return getErrorArray(schema?.toString())[0] ?? '';
};

export const typeToPrint = (str: string) => str;
export const objectToPrint = (str: string) => '{' + str + '}';
export const quote = (str: string) => (/\s/.test(str) ? `"${str}"` : str);

export const getErrorArray = (
  ...val: ReadonlyArray<string | undefined | ReadonlyArray<string | undefined>>
): readonly string[] => [...val].flat().filter((x): x is string => typeof x === 'string');

export const unionToPrint = (arr: readonly (string | undefined)[]): string => {
  const filteredArray = getErrorArray(arr);
  const str = filteredArray.join(' | ');

  if (filteredArray.length > 1) {
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
