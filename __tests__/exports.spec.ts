/* eslint-disable import/dynamic-import-chunkname */
import Fs from 'fs';
import Path, { resolve, extname } from 'path';
import Url from 'url';

describe('check exports', () => {
  describe('validators', () => {
    const validatorsDir = Fs.readdirSync(
      resolve(Path.dirname(Url.fileURLToPath(import.meta.url)), '..', 'src', 'validators'),
    );
    const validators = validatorsDir
      .filter((filename) => !filename.startsWith('__'))
      .map((name) => (extname(name).length ? name.slice(0, -extname(name).length) : name));

    it.each(validators)(`%s should be exported from index.ts`, async (v) =>
      expect(Object.keys(await import('../src/index'))).toContain(v),
    );
  });

  describe('modifiers', () => {
    const modifiersDir = Fs.readdirSync(
      resolve(Path.dirname(Url.fileURLToPath(import.meta.url)), '..', 'src', 'modifiers'),
    );
    const modifiers = modifiersDir
      .filter((filename) => !filename.startsWith('__'))
      .map((name) => (extname(name).length ? name.slice(0, -extname(name).length) : name));

    it.each(modifiers)(`%s should be exported from index.ts`, async (v) =>
      expect(Object.keys(await import('../src/index'))).toContain(v),
    );
  });
});
