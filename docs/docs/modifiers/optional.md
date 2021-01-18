---
id: optional
title: optional
---

If you use the `optional` modifier, given schema will be extended to also match `undefined` values, and its output type will be `undefined | T`.

```ts
const optionalRoleSchema = optional(oneOf(['User', 'Admin']));
const optionalRoleValidator = validate(optionalRoleSchema);

// Returns 'User', the output type is undefined | 'User' | 'Admin'
const role = optionalRoleValidator('User');

// Both return undefined
optionalRoleValidator();
optionalRoleValidator(undefined);

// Throws validation error
optionalRoleValidator(null);
```
