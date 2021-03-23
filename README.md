# @typeofweb/schema

`@typeofweb/schema` is a lightweight and extensible library for data validation with full TypeScript support!

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-8-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![codecov](https://codecov.io/gh/typeofweb/schema/branch/main/graph/badge.svg?token=6DNCIHEEUO)](https://codecov.io/gh/typeofweb/schema)
[![npm](https://img.shields.io/npm/v/@typeofweb/schema.svg)](https://www.npmjs.com/package/@typeofweb/schema)
[![npm bundle size (minified + gzip)](https://badgen.net/bundlephobia/minzip/@typeofweb/schema)](https://bundlephobia.com/result?p=@typeofweb/schema)
[![no external dependencies](https://badgen.net/bundlephobia/dependency-count/@typeofweb/schema)](https://bundlephobia.com/result?p=@typeofweb/schema)
[![tree-shakeable](https://badgen.net/bundlephobia/tree-shaking/@typeofweb/schema)](https://bundlephobia.com/result?p=@typeofweb/schema)

## Docs

### 👉 [schema.typeofweb.com](https://schema.typeofweb.com/) 👈

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://typeofweb.com/"><img src="https://avatars0.githubusercontent.com/u/1338731?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michał Miszczyszyn</b></sub></a><br /><a href="https://github.com/typeofweb/schema/commits?author=mmiszy" title="Code">💻</a> <a href="#maintenance-mmiszy" title="Maintenance">🚧</a> <a href="#projectManagement-mmiszy" title="Project Management">📆</a> <a href="https://github.com/typeofweb/schema/pulls?q=is%3Apr+reviewed-by%3Ammiszy" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/wisnie"><img src="https://avatars3.githubusercontent.com/u/47081011?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bartłomiej Wiśniewski</b></sub></a><br /><a href="https://github.com/typeofweb/schema/commits?author=wisnie" title="Code">💻</a> <a href="https://github.com/typeofweb/schema/pulls?q=is%3Apr+reviewed-by%3Awisnie" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/typeofweb/schema/issues?q=author%3Awisnie" title="Bug reports">🐛</a> <a href="https://github.com/typeofweb/schema/commits?author=wisnie" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/AdamSiekierski"><img src="https://avatars0.githubusercontent.com/u/24841038?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adam Siekierski</b></sub></a><br /><a href="https://github.com/typeofweb/schema/pulls?q=is%3Apr+reviewed-by%3AAdamSiekierski" title="Reviewed Pull Requests">👀</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/asottile"><img src="https://avatars3.githubusercontent.com/u/1810591?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Anthony Sottile</b></sub></a><br /><a href="#security-asottile" title="Security">🛡️</a></td>
    <td align="center"><a href="https://devalchemist.com"><img src="https://avatars.githubusercontent.com/u/1423385?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Marek</b></sub></a><br /><a href="https://github.com/typeofweb/schema/commits?author=malydok" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.upwork.com/freelancers/~018e2d48fa8a42e825"><img src="https://avatars.githubusercontent.com/u/9992724?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Olzhas Alexandrov</b></sub></a><br /><a href="https://github.com/typeofweb/schema/issues?q=author%3Ao-alexandrov" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/Aliath"><img src="https://avatars.githubusercontent.com/u/28493823?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bartek Słysz</b></sub></a><br /><a href="https://github.com/typeofweb/schema/issues?q=author%3AAliath" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/stepaniukm"><img src="https://avatars.githubusercontent.com/u/28492390?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mateusz Stepaniuk</b></sub></a><br /><a href="#ideas-stepaniukm" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Example

```ts
import { number, object, optional, string, validate } from '@typeofweb/schema';

const personSchema = object({
  name: string(),
  age: number(),
  email: optional(string()),
})();

const mark = {
  name: 'Mark',
  age: 29,
};

const personValidator = validate(personSchema);

// If validation is successful returns data with correct type, throws ValidationError otherwise
const validatedPerson = personValidator(mark);
```

## Early benchmarks

Early benchmarks show some really promising performance of `@typeofweb/schema` when compared to other industry-leading solutions:

```
Platform info:
==============
   Darwin 20.3.0 x64
   Node.JS: 14.16.0
   V8: 8.4.371.19-node.18
   Intel(R) Core(TM) i7-6920HQ CPU @ 2.90GHz × 8
```

| library               | relative speed | operations per second | avg. operation time |
| --------------------- | -------------: | --------------------: | ------------------: |
| **@typeofweb/schema** |        **ref** |   **(1,934,098 rps)** |  **(avg: 0.517μs)** |
| io-ts@2.2.13          |         -7.21% |       (1,794,594 rps) |      (avg: 0.557μs) |
| mschema@0.5.6         |         -69.8% |         (584,151 rps) |          (avg: 1μs) |
| validator.js@2.0.4    |        -76.16% |         (461,088 rps) |          (avg: 2μs) |
| validate.js@0.13.1    |        -89.02% |         (212,408 rps) |          (avg: 4μs) |
| validatorjs@3.22.1    |         -92.2% |         (150,791 rps) |          (avg: 6μs) |
| joi@17.3.0            |        -93.25% |         (130,541 rps) |          (avg: 7μs) |
| superstruct@0.13.3    |        -96.99% |          (58,197 rps) |         (avg: 17μs) |
| yup@0.32.8            |        -97.09% |          (56,243 rps) |         (avg: 17μs) |
| parambulator@1.5.2    |        -98.99% |          (19,492 rps) |         (avg: 51μs) |
| zod@1.11.11           |        -99.03% |          (18,827 rps) |         (avg: 53μs) |

### 👉 [schema.typeofweb.com](https://schema.typeofweb.com/) 👈
