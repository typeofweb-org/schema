import { join } from 'path';

import { identity } from 'ramda';
import tsd from 'tsd';

describe('@typeofweb/schema', () => {
  it.skip('tsd', async () => {
    const diagnostics = await tsd({
      cwd: join(__dirname, '..'),
      typingsFile: './dist/index.d.ts',
      testFiles: ['./__tests__/*.test-d.ts'],
    });

    if (diagnostics.length > 0) {
      const errorMessage = diagnostics.map((test) => {
        return (
          [test.fileName, test.line, test.column].filter(identity).join(':') +
          ` - ${test.severity} - ${test.message}`
        );
      });
      fail('\n' + errorMessage.join('\n') + '\n');
    }
  });
});
