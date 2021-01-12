beforeAll(() => {
  process.on('unhandledRejection', fail);
  process.on('uncaughtException', fail);
});
afterAll(() => {
  process.removeListener('unhandledRejection', fail);
  process.removeListener('uncaughtException', fail);
});
