# @typeofweb/schema

[![codecov](https://codecov.io/gh/typeofweb/schema/branch/main/graph/badge.svg?token=6DNCIHEEUO)](https://codecov.io/gh/typeofweb/schema)
[![npm](https://img.shields.io/npm/v/@typeofweb/schema.svg)](https://www.npmjs.com/package/@typeofweb/schema)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@typeofweb/schema.svg)](https://www.npmjs.com/package/@typeofweb/schema)

## Table of contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Example](#example)
- [API](#api)
  - [oneOf](#oneOf)
  - [string](#string)
  - [number](#number)
  - [boolean](#boolean)
  - [date](#date)
  - [object](#object)
  - [array](#array)
  - [Modifiers](#modifiers)
    - [nullable](#nullable)
    - [optional](#optional)
    - [nil](#nil)

## Introduction

@typeofweb/schema is a lightweight and extensible library for data validation with full support for TypeScript!

## Installation

Install the package with npm:

`npm install @typeofweb/schema`

or install the package with yarn:

`yarn add @typeofweb/schema`

## Example

```js
const personSchema = object({
  name: string(),
  age: number(),
  email: optional(string()),
});

const mark = {
  name: 'Mark',
  age: 29,
};

const personValidator = validate(personSchema);

// If validation is successful returns data with correct type, throws error otherwise
const validatedPerson = personValidator(mark);
```

## API

### oneOf

Generates a schema which matches only specified values.

```ts
const fishSchema = oneOf(['trout', 'catfish']);
const fishValidator = validate(fishSchema);

// Returns 'trout'
const trout = fishValidator('trout');

// Throws ValidationError
const salmon = fishValidator('salmon');
```

### string

Creates a schema that matches strings.

```ts
const stringSchema = string();
const stringValidator = validate(stringSchema);

// Return 'Micheal'
const micheal = stringValidator('Micheal');
```

### number

Creates a schema that matches numbers.

```ts
const numberSchema = number();
const numberValidator = validate(numberSchema);

// Returns 3.14
const pi = numberValidator(3.14);
```

### boolean

Creates a schema that matches booleans.

```ts
const booleanSchema = boolean();
const booleanValidator = validate(booleanSchema);

// Returns true
const loading = booleanValidator(true);
```

### date

Creates a schema that matches JavaScript `Date` objects.

```ts
const dateSchema = date();
const dateValidator = validate(dateSchema);

// Returns Date Tue Jan 12 2021 22:00:20 GMT+0100 (Central European Standard Time)
const annieBirthday = dateValidator(
  new Date('Tue Jan 12 2021 22:00:20 GMT+0100 (Central European Standard Time)'),
);
```

### object

Creates a schema that matches objects of provided shape.

```ts
const carSchema = object({
  manufacturer: string(),
  model: string(),
  mass: number(),
  enginePower: number(),
  fuelCapacity: number(),
});
const carValidator = validate(carSchema);

/* Returns {
  manufacturer: 'Typeofweb enterprise',
  model: 'x1024',
  mass: 1600,
  enginePower: 135,
  fuelCapacity: 59,
} */
const matthewCar = carValidator({
  manufacturer: 'Type of Web Enterprise',
  model: 'x1024',
  mass: 1600,
  enginePower: 135,
  fuelCapacity: 59,
});
```

### array

Creates a schema that matches arrays containing values specified by the schemas passed in the array.

```ts
const musicGenresSchema = array([string()]);
const musicGenresValidator = validate(musicGenresSchema);

// Returns ['classical', 'lofi', 'pop']
const musicGenres = musicGenresValidator(['classical', 'lofi', 'pop']);
```

### Modifiers

Modifiers are used to customize schemas and change their validation behaviour.

#### nullable

If you use the `nullable` modifier, given schema will be extended to also match `null` values, and its output type will be `null | T`.

```ts
const nullableRoleSchema = nullable(oneOf(['User', 'Admin']));
const nullableRoleValidator = validate(nullableRoleSchema);

// Returns 'User', the output type is null | 'User' | 'Admin'
const role = nullableRoleValidator('User');

// It's also fine
nullableRoleValidator(null);

// Throws ValidationError
nullableRoleValidator();
nullableRoleValidator(undefined);
```

### optional

If you use the `optional` modifier, given schema will be extended to also match `undefined` values, and its output type will be `undefined | T`.

```ts
const optionalRoleSchema = optional(oneOf(['User', 'Admin']));
const optionalRoleValidator = validate(optionalRoleSchema);

// Returns 'User', the output type is undefined | 'User' | 'Admin'
const role = optionalRoleValidator('User');

// It's also fine
optionalRoleValidator();
optionalRoleValidator(undefined);

// Throws validation error
optionalRoleValidator(null);
```

### nil

If you use the `nil` modifier, given schema will be extended to also match `null` and `undefined` values, and its output type will be `null | undefined | T`.

```ts
const nilRoleSchema = nil(oneOf(['User', 'Admin']));
const nilRoleValidator = validate(nilRoleSchema);

// Returns 'User', the output type is undefined | null | 'User' | 'Admin'
const role = nilRoleValidator('User');

// It's also fine
nilRoleValidator();
nilRoleValidator(undefined);
nilRoleValidator(null);
```
