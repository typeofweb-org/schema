---
id: nullable
title: nullable
---

If you use the `nullable` modifier, given schema will be extended to also match `null` values, and its output type will be `null | T`.

```ts
const nullableRoleSchema = nullable(oneOf(['User', 'Admin']));
const nullableRoleValidator = validate(nullableRoleSchema);

// Returns 'User', the output type is null | 'User' | 'Admin'
const role = nullableRoleValidator('User');

// Returns null
nullableRoleValidator(null);

// Throws ValidationError
nullableRoleValidator();
nullableRoleValidator(undefined);
```
