// @ts-check
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

import pkg from './package.json';

const rollupConfig = [
  {
    input: 'src/index.ts',
    output: [
      {
        name: '@typeofweb/schema',
        format: 'es',
        dir: './',
        entryFileNames: pkg.module,
      },
      {
        name: '@typeofweb/schema',
        format: 'cjs',
        dir: './',
        entryFileNames: pkg.main,
      },
      {
        name: '@typeofweb/schema',
        entryFileNames: pkg.browser,
        format: 'umd',
        dir: './'
      },
    ],
    plugins: [
      resolve(),
      commonjs({
        include: 'node_modules/**',
      }),
      typescript({
        tsconfig: "tsconfig.json",
        declaration: true,
        declarationDir: 'dist/',
        rootDir: 'src/',
        module: "ES2020",
      }),
    ],
  },
];
// eslint-disable-next-line import/no-default-export
export default rollupConfig;
