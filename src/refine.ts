import type { ValidationError } from './errors';
import { minLength } from './modifiers/minLength';
import { optional } from './modifiers/optional';
import type { initialModifiers } from './schema';
import type {
  DefaultModifiers,
  DefaultValues,
  Either,
  IfAny,
  MergeModifiers,
  Schema,
  SomeSchema,
  TypeOf,
} from './types';
import { left, right } from './utils/either';
import { pipe } from './utils/pipe';
import { validate } from './validators/__validate';
import { array } from './validators/array';
import { number } from './validators/number';
import { string } from './validators/string';
import { unknown } from './validators/unknown';

import { nullable } from '.';

const CONTINUE = Symbol('@typeofweb/schema/continue');
type CONTINUE = typeof CONTINUE;

type ExitEarly<Output> = Output | Either<Output, any> | CONTINUE;
type Refinement<Output, Input, R extends ExitEarly<Output>> = (
  value: Input,
  t: RefinementToolkit,
) => R;

const refinementToolkit = {
  right,
  left,
  continue: CONTINUE,
} as const;
type RefinementToolkit = typeof refinementToolkit;

export const refine = <Output, Input, RefinementResult extends ExitEarly<Output>>(
  refinement: Refinement<Output, Input, RefinementResult>,
) => <S extends SomeSchema<Input>>(
  schema?:
    | (RefinementResult extends { readonly _t: 'right'; readonly value: infer ExitEarlyResult }
        ? SomeSchema<ExitEarlyResult>
        : S)
    | undefined,
) => {
  type Modifiers = undefined extends S
    ? DefaultModifiers
    : S extends { readonly __modifiers: DefaultModifiers }
    ? S['__modifiers']
    : DefaultModifiers;
  type Values = undefined extends S
    ? DefaultValues
    : S extends { readonly __values: DefaultValues }
    ? S['__values']
    : DefaultValues;

  type Optional = Output extends undefined ? true : Modifiers['optional'];
  type Nullable = Output extends null ? true : Modifiers['nullable'];

  type TypeOfResult =
    | (unknown extends Output ? never : readonly unknown[] extends Output ? never : Output)
    | (undefined extends S ? never : S extends {} ? S['__type'] : never);

  // @todo
  return {} as Schema<
    RefinementResult extends { readonly _t: 'right'; readonly value: infer ExitEarlyResult }
      ? ExitEarlyResult
      : TypeOfResult extends never
      ? Output
      : IfAny<TypeOfResult, Output>,
    MergeModifiers<
      Modifiers,
      {
        readonly optional: Optional;
        readonly nullable: Nullable;
      }
    >,
    Values
  >;
};
