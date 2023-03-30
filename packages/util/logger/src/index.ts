
class Logger {
  private util = require('util');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  noOp = (message?: any, ...optionalParams: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const colorfulParams = optionalParams;
  };

  log = (message?: any, ...optionalParams: any[]) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const colorfulParams = this.util.inspect(optionalParams, { colors: true, depth: 5 })
      console.log(`------    NotionService  ${message}`, colorfulParams);
  };

  debug = (message?: any, ...optionalParams: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const colorfulParams = this.util.inspect(optionalParams, { colors: true, depth: 5 })
    console.debug(`------    NotionService  ${message}`, colorfulParams);
  };

  info = (message?: any, ...optionalParams: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const colorfulParams = this.util.inspect(optionalParams, { colors: true, depth: 4 })
    console.info(`------    NotionService  ${message}`, colorfulParams);
  };

  warn = (message?: any, ...optionalParams: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const colorfulParams = this.util.inspect(optionalParams, { colors: true, depth: 3 })
    console.warn(`------    NotionService  ${message}`, colorfulParams);
  };

  error = (error: unknown, ...optionalParams: any[]) => {
    const colorfulParams = this.util.inspect(optionalParams, { colors: true, depth: 2 })
    console.error(`------    NotionService  ${colorfulParams}`, colorfulParams);
  }
}

export const newLogger = () => new Logger();
