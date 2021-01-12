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
        file: pkg.main,
        format: 'cjs',
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
        declarationDir: 'dist/types/',
        rootDir: 'src/'
      }),
    ],
  },
];
// eslint-disable-next-line import/no-default-export
export default rollupConfig;
