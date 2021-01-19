---
id: boolean
title: boolean
---

Creates a schema that matches booleans.

```ts
const booleanSchema = boolean();
const booleanValidator = validate(booleanSchema);

// Returns true
const loading = booleanValidator(true);
```
