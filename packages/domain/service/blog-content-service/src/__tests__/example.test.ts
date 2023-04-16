import { newLogger } from "logger";

const logger = newLogger("logger test");
logger.debug = logger.noOp;

describe("blog-content-service", () => {

  it("test exampple", () => {
    expect("").toBe("");
  });

});
