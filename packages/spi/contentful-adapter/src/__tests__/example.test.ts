import { newLogger } from "logger";

const logger = newLogger("logger test");
logger.debug = logger.noOp;

describe("contentful-adapter", () => {

  it("test exampple", () => {
    expect("").toBe("");
  });

});
