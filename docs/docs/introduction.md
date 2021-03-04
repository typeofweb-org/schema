---
id: introduction
title: Introduction
slug: /
---

`@typeofweb/schema` is a lightweight and extensible library for data validation with full TypeScript support!

[![codecov](https://codecov.io/gh/typeofweb/schema/branch/main/graph/badge.svg?token=6DNCIHEEUO)](https://codecov.io/gh/typeofweb/schema)
[![npm](https://img.shields.io/npm/v/@typeofweb/schema.svg)](https://www.npmjs.com/package/@typeofweb/schema)
[![npm bundle size (minified + gzip)](https://badgen.net/bundlephobia/minzip/@typeofweb/schema)](https://bundlephobia.com/result?p=@typeofweb/schema)
[![no external dependencies](https://badgen.net/bundlephobia/dependency-count/@typeofweb/schema)](https://bundlephobia.com/result?p=@typeofweb/schema)
[![tree-shakeable](https://badgen.net/bundlephobia/tree-shaking/@typeofweb/schema)](https://bundlephobia.com/result?p=@typeofweb/schema)

## Validation

```ts
import { number, object, optional, string, validate } from '@typeofweb/schema';

const personSchema = object({
  name: string(),
  age: number(),
  email: optional(string()),
})();

const mark = {
  name: 'Mark',
  age: 29,
};

const personValidator = validate(personSchema);

const validatedPerson = personValidator(mark);
// returns
// {
//   readonly name: string;
//   readonly age: number;
//   readonly email?: string | undefined;
// }
```

## Intuitive coercion

```ts
import { number, object, date, validate } from '@typeofweb/schema';

const userQuery = object({
  dob: date(),
  query: number(),
})();

const payload = {
  dob: '2001-04-16T00:00:00.000Z',
  query: '123',
};

const userQueryValidator = validate(userQuery);

const result = userQueryValidator(payload);
// returns
// {
//   readonly dob: Date;
//   readonly query: number;
// }
```

## Descriptive errors

```ts
import { string, object, array, validate } from '@typeofweb/schema';

const validator = validate(array(object({ a: string() })())());

const result = validator([123]);
// throws ValidationError: Invalid type! Expected { a: string }[] but got [123]!
```

## Types generated from validators

```ts
import { number, object, optional, string, TypeOf } from '@typeofweb/schema';

const personSchema = object({
  name: string(),
  age: number(),
  email: optional(string()),
})();

type Person = TypeOf<typeof personSchema>;
// type Person = {
//   readonly name: string;
//   readonly age: number;
//   readonly email?: string | undefined;
// }
```
