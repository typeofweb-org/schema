---
id: object
title: object
---

Creates a schema that matches objects of provided shape.

```ts
const carSchema = object({
  manufacturer: string(),
  model: string(),
  mass: number(),
  enginePower: number(),
  fuelCapacity: number(),
})();
const carValidator = validate(carSchema);

/* Returns {
  manufacturer: 'Type of Web Enterprise',
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

## `allowUnknownKeys`

The `allowUnknownKeys` option is used to not throw validation error on unspecifed fields in object (`false` by default):

```ts
const computerSchema = object(
  {
    cpuModel: string(),
    gpuModel: string(),
    RAM: number(),
  },
  { allowUnknownKeys: false },
)();

const anotherComputerSchema = object(
  {
    cpuModel: string(),
    gpuModel: string(),
    RAM: number(),
  },
  { allowUnknownKeys: true },
)();

const computer = {
  cpuModel: 'Intel',
  gpuModel: 'Nvidia',
  RAM: 8,
  motherboard: 'MSI',
};

// Throws ValidationError
validate(computerSchema)(computer);

// It's fine
validate(anotherComputerSchema)(computer);
```
