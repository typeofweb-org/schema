import type { ErrorDataObject } from '../src';
import { isErrorDataObject } from '../src';

describe('guards', () => {
  describe('isErrorDataObject', () => {
    it('returns true for ErrorDataObject', () => {
      const errorData: ErrorDataObject = {
        expected: 'object',
        got: 'some string',
        errors: [],
      };
      expect(isErrorDataObject(errorData)).toBeTruthy();
    });
  });
});
