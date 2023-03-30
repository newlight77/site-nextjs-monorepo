import { newLogger } from "..";

const logger = newLogger();

jest.spyOn(global.console, "log");

describe("logger", () => {
  it("prints a message", () => {
    logger.log("hello");
    expect(console.log).toBeCalled();
  });
});
