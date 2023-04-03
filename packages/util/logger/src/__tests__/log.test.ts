import { newLogger } from "..";

const logger = newLogger("logger test");

jest.spyOn(global.console, "log");

describe("logger", () => {
  it("prints a message", () => {
    logger.log("hello");
    expect(console.log).toBeCalled();
  });
});
