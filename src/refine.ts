import { unionToPrint } from './stringify';
import type { Either, If, Pretty, SomeSchema } from './types';
import type { Next } from './utils/either';
import { left, right, next } from './utils/either';

type Refinement<NextResult, Input, ExitEarlyResult> = (
  this: SomeSchema<any>,
  value: Input,
  t: RefinementToolkit,
) => Either<ExitEarlyResult, any> | Next<NextResult>;

const refinementToolkit = {
  right,
  left,
  next,
} as const;
type RefinementToolkit = typeof refinementToolkit;

export const refine = <Output, Input, ExitEarlyResult = never>(
  refinement: Refinement<Output, Input, ExitEarlyResult>,
  toString?: () => string,
) => <S extends SomeSchema<Input>>(schema?: S) => {
  type HasExitEarlyResult = unknown extends ExitEarlyResult
    ? false
    : ExitEarlyResult extends never
    ? false
    : readonly unknown[] extends ExitEarlyResult
    ? false
    : true;

  type HasOutput = unknown extends Output
    ? false
    : Output extends never
    ? false
    : {} extends Output
    ? true
    : // : readonly unknown[] extends Output
      // ? false
      true;

  type Result =
    | If<true, HasExitEarlyResult, ExitEarlyResult>
    | If<
        true,
        HasOutput,
        // if schema is an array schema
        S['__type'] extends readonly (infer TypeOfSchemaElement)[]
          ? // and Output is a *tuple* schema
            Output extends readonly [...infer _]
            ? // replace each tuple element in Output with the type of element from schema
              { readonly [Index in keyof Output]: TypeOfSchemaElement }
            : Output
          : Output
      >
    | If<false, HasExitEarlyResult, S['__type']>
    | If<false, HasOutput | HasExitEarlyResult, S['__type']>;

  return {
    ...schema,
    toString() {
      return unionToPrint([schema?.toString()!, toString?.()!].filter(Boolean));
    },
    __validate(val) {
      // eslint-disable-next-line functional/no-this-expression
      const innerResult = refinement.call(this, val as Input, refinementToolkit);

      if (innerResult?._t === 'left' || innerResult?._t === 'right') {
        return innerResult;
      }
      if (!schema) {
        return innerResult;
      }
      return schema.__validate(innerResult.value);
    },
  } as SomeSchema<Pretty<Result>>;
};
