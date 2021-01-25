export const isDate = (d: unknown): d is Date =>
  Object.prototype.toString.call(d) === '[object Date]';

const simplifiedISODateStringRegex = /^[+-]?\d{4}/;
export const isISODateString = (value: string) => simplifiedISODateStringRegex.test(value);
