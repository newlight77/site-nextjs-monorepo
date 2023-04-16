import { newLogger } from "logger";

const logger = newLogger("logger test");
logger.debug = logger.noOp;

describe("react-library", () => {

  it("test exampple", () => {
    expect("").toBe("");
  });

});
