---
id: number
title: number
---

Creates a schema that matches numbers:

```ts
const numberSchema = number();
const numberValidator = validate(numberSchema);

// Returns 3.14
const pi = numberValidator(3.14);
```
