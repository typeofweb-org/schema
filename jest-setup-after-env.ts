beforeAll(() => {
  process.on('unhandledRejection', (err) => fail(err));
  process.on('uncaughtException', (err) => fail(err));
});
afterAll(() => {
  process.removeListener('unhandledRejection', (err) => fail(err));
  process.removeListener('uncaughtException', (err) => fail(err));
});
export {};
