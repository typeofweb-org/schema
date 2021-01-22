import type { SomeSchema } from '../types';

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
export const getModifiers = (v: SomeSchema<any>): readonly string[] => {
  const modifiers = [v.__modifiers.optional && 'undefined', v.__modifiers.nullable && 'null'];
  return modifiers.filter((m): m is string => Boolean(m));
};

declare global {
  interface Array<T> {
    includes(searchElement: unknown, fromIndex?: number): searchElement is T;
  }

  interface ReadonlyArray<T> {
    includes(searchElement: unknown, fromIndex?: number): searchElement is T;
  }
}
