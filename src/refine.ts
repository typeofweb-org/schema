import type { ValidationError } from './errors';
import { minLength } from './modifiers/minLength';
import { optional } from './modifiers/optional';
import type { DefaultValues, Either, IfAny, Pretty, Schema, SomeSchema, TypeOf } from './types';
import { left, right } from './utils/either';
import { pipe } from './utils/pipe';
import { validate } from './validators/__validate';
import { array } from './validators/array';
import { number } from './validators/number';
import { string } from './validators/string';
import { unknown } from './validators/unknown';

import { nullable } from '.';

const CONTINUE = Symbol('@typeofweb/schema/continue');
type Continue<Output> = { readonly [CONTINUE]: Output };
const Continue = <Output>(value: Output) => ({ [CONTINUE]: value });

type ExitEarly<Output> = Either<Output, any> | Continue<Output>;
type Refinement<Output, Input, R extends ExitEarly<Output>> = (
  value: Input,
  t: RefinementToolkit,
) => R;

const refinementToolkit = {
  right,
  left,
  continue: Continue,
} as const;
type RefinementToolkit = typeof refinementToolkit;

export const refine = <Output, Input, RefinementResult extends ExitEarly<Output>>(
  refinement: Refinement<Output, Input, RefinementResult>,
) => <S extends SomeSchema<Input>>(schema?: S | undefined) => {
  type Values = undefined extends S
    ? DefaultValues
    : S extends { readonly __values: DefaultValues }
    ? S['__values']
    : DefaultValues;

  type TypeOfResult =
    | (unknown extends Output ? never : readonly unknown[] extends Output ? never : Output)
    | (undefined extends S ? never : S extends {} ? S['__type'] : never);

  return {} as Schema<
    RefinementResult extends { readonly _t: 'right'; readonly value: infer ExitEarlyResult1 }
      ? ExitEarlyResult1
      : TypeOfResult extends Continue<infer ExitEarlyResult3>
      ? ExitEarlyResult3
      : // : RefinementResult extends Continue<infer ExitEarlyResult2>
      // ? ExitEarlyResult2
      TypeOfResult extends never
      ? Output
      : unknown extends TypeOfResult
      ? never
      : TypeOfResult,
    Values
  >;

  // return {} as Schema<
  //   RefinementResult extends { readonly _t: 'right'; readonly value: infer ExitEarlyResult }
  //     ? ExitEarlyResult
  //     : TypeOfResult extends never
  //     ? Output
  //     : IfAny<TypeOfResult, Output>,
  //   Values
  // >;
};
