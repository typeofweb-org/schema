import { ErrorDataArgs } from '../errors';
import { refine } from '../refine';

export const minStringLength = <L extends number>(minLength: L) =>
  refine((value: string, t) =>
    value.length >= minLength
      ? t.nextValid(value)
      : t.left(new ErrorDataArgs('minStringLength', value, [minLength])),
  );
