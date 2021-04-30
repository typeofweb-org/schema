// import { unionToPrint } from './stringify';
import type { Either, If, Next, Pretty, SomeSchema } from './types';
import { left, right, nextValid, nextNotValid } from './utils/either';

type Refinement<NextResult, Input, ExitEarlyResult> = (
  this: SomeSchema<any>,
  value: Input,
  t: RefinementToolkit,
) => Either<ExitEarlyResult, any> | Next<NextResult>;

const refinementToolkit = {
  right: right,
  left: left,
  nextValid,
  nextNotValid,
} as const;
type RefinementToolkit = typeof refinementToolkit;

export const refine = <Output, Input, ExitEarlyResult = never>(
  refinement: Refinement<Output, Input, ExitEarlyResult>,
  currentToString: (outerToString?: () => string) => string,
) => <S extends SomeSchema<Input>>(innerSchema?: S) => {
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
    ...innerSchema,
    toString(outerToString) {
      // // return schema ? schema.toString(() => toString(outerToString)) : toString(outerToString);
      // // unionToPrint([schema?.toString(), toString()].flat())
      // console.log(
      //   innerSchema?.toString(outerToString),
      //   currentToString(outerToString),
      //   innerSchema?.toString(() => currentToString(outerToString)),
      // );
      // return [
      //   unionToPrint([innerSchema?.toString(), currentToString()].flat()),
      // ] as readonly string[];
      // // return [toString(), ...(schema?.toString(() => toString()) ?? [])] as readonly string[];
      return '3';
    },
    __validate(val) {
      // eslint-disable-next-line functional/no-this-expression
      const innerResult = refinement.call(this, val as Input, refinementToolkit);

      if (innerResult?._t === 'left' || innerResult?._t === 'right') {
        return innerResult;
      }
      if (!innerSchema) {
        return innerResult;
      }
      return innerSchema.__validate(innerResult.value);
    },
  } as SomeSchema<Pretty<Result>>;
};

export const modifierToString = (str: string): Parameters<typeof refine>[1] => (outerToString) => {
  return '2';
};

export const simpleTypeToString = (str: string): Parameters<typeof refine>[1] => (
  outerToString,
) => {
  return '1';
};
