---
id: nil
title: nil
---

If you use the `nil` modifier, given schema will be extended to also match `null` and `undefined` values, and its output type will be `null | undefined | T`.

```ts
const nilRoleSchema = nil(oneOf(['User', 'Admin']));
const nilRoleValidator = validate(nilRoleSchema);

// Returns 'User', the output type is undefined | null | 'User' | 'Admin'
const role = nilRoleValidator('User');

// Both return undefined
nilRoleValidator();
nilRoleValidator(undefined);
// Returns null
nilRoleValidator(null);
```
