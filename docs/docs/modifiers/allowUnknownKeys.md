---
id: allowUnknownKeys
title: allowUnknownKeys
---

The `allowUnknownKeys` modifier is used to not throw validation error on unspecifed fields in object.

```ts
const computerSchema = object({
  cpuModel: string(),
  gpuModel: string(),
  RAM: number(),
});

const anotherComputerSchema = allowUnknownKeys(computerSchema);

const computer = {
  cpuModel: 'Intel',
  gpuModel: 'Nvidia',
  RAM: 8,
  motherboard: 'MSI',
};

// It's fine
validate(anotherComputerSchema)(computer);

// Throws ValidationError
validate(computerSchema)(computer);
```
