---
id: basic-example
title: Basic example
---

```ts
import { number, object, optional, string, validate } from '@typeofweb/schema';

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

// If validation is successful returns data with correct type, throws ValidationError otherwise
const validatedPerson = personValidator(mark);
```
