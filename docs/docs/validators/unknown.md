---
id: unknown
title: unknown
---

Creates a schema that matches anything and everything including undefined, null or no value at all.

```ts
const whateverSchema = unknown();
const whateverValidator = validate(whateverSchema);

// It's fine
whateverValidator();
whateverValidator(123123);
whateverValidator(null);
whateverValidator({ foo: 'bar' });
whateverValidator([null, 3, 'hello']);
// The output type is unknown
```
