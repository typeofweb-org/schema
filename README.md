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

@typeofweb/schema is lightweight, extensible library for data validation.

## Installation

Install package with npm:

`npm install @typeofweb/schema`

Install package with yarn:

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

Generates a schema which will match only specified values.

```js
const fishSchema = oneOf(['trout', 'catfish']);
const fishValidator = validate(fishSchema);

// Returns 'trout'
const trout = fishValidator('trout');

// Throws validation error
const salmon = fishValidator('salmon');
```

### string

Generates schema that will match string.

```js
const stringSchema = string();
const stringValidator = validate(stringSchema);

// Return 'Micheal'
const micheal = stringValidator('Micheal');
```

### number

Generates schema that will match number.

```js
const numberSchema = string();
const numberValidator = validate(numberSchema);

// Return 3.14
const pi = numberValidator(3.14);
```

### boolean

Generates schema that will match boolean.

```js
const booleanSchema = string();
const booleanValidator = validate(booleanSchema);

// Returns true
const loading = booleanValidator(true);
```

### date

Generates schema that will match date.

```js
const dateSchema = date();
const dateValidator = validate(dateSchema);

// Returns Date Tue Jan 12 2021 22:00:20 GMT+0100 (Central European Standard Time)
const annieBirthday = dateValidator(
  new Date('Tue Jan 12 2021 22:00:20 GMT+0100 (Central European Standard Time)'),
);
```

### object

Generates schema that will match object.

```js
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
  manufacturer: 'Typeofweb enterprise',
  model: 'x1024',
  mass: 1600,
  enginePower: 135,
  fuelCapacity: 59,
});
```

### array

Generates schema that will match all values specifiec in the schemas in the array.

```js
const musicGenresSchema = array([string()]);
const musicGenresValidator = validate(musicGenresSchema);

// Returns ['classical', 'lofi', 'pop']
const musicGenres = musicGenresValidator(['classical', 'lofi', 'pop']);
```

### Modifiers

Modifers are used to customize the schema and change the validation behaviour.

#### nullable

If you use nullable modifier, output type will be `null | InferredType`.

```js
const nullableRoleSchema = nullable(oneOf(['User', 'Admin']));
const nullableRoleValidator = validate(nullableRoleSchema);

// Returns 'User', the output type is null | 'User' | 'Admin'
const role = nullableRoleValidator('User');
```

### optional

If you use optional modifier, output type will be `undefined | InferredType`.

```js
const optionalRoleSchema = optional(oneOf(['User', 'Admin']));
const optionalRoleValidator = validate(optionalRoleSchema);

// Returns 'User', the output type is undefined | 'User' | 'Admin'
const role = optionalRoleValidator('User');
```

### nil

If you use nil modifier, output type will be `undefined | null | InferredType`.

```js
const nilRoleSchema = nil(oneOf(['User', 'Admin']));
const nilRoleValidator = validate(nilRoleSchema);

// Returns 'User', the output type is undefined | null | 'User' | 'Admin'
const role = nilRoleValidator('User');
```
