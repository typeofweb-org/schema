import { refine } from '../refine';

export const minStringLength = <L extends number>(minLength: L) =>
  refine((value: string, t) => (value.length >= minLength ? t.next(value) : t.left(value)));
