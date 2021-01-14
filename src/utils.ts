export const isDate = (d: unknown): d is Date =>
  Object.prototype.toString.call(d) === '[object Date]';

export const fromEntries = (entries: readonly (readonly [string | number, any])[]) => {
  const obj: Record<keyof any, any> = {};
  // eslint-disable-next-line functional/no-loop-statement
  for (let i = 0; i < entries.length; ++i) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    obj[entries[i]![0]] = entries[i]![1];
  }

  return obj;
};
