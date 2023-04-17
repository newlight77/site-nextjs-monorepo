import { newLogger } from "..";

const logger = newLogger("logger test");



describe("logger", () => {

  const origConsole = global.console;
  jest.spyOn(global.console, "info");
  
  afterAll(() => global.console = origConsole)

  it("prints a message", () => {
    logger.info("hello");
    expect(console.info).toBeCalled();
  });
});
