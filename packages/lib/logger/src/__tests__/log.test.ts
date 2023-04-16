import { newLogger } from "..";

const logger = newLogger("logger test");



describe("logger", () => {

  const origConsole = global.console;
  jest.spyOn(global.console, "log");
  
  afterAll(() => global.console = origConsole)

  it("prints a message", () => {
    logger.log("hello");
    expect(console.log).toBeCalled();
  });
});
