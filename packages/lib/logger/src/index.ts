
class Logger {
  private util = require('util');

  constructor(private name: string) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  noOp = (message?: any, ...optionalParams: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const colorfulParams = optionalParams;
  };

  debug = (message?: any, ...optionalParams: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const colorfulParams = this.util.inspect(optionalParams, { colors: true, depth: 20 })
    console.debug(`------    ${this.name}  ${message}`, colorfulParams);
  };

  log = (message?: any, ...optionalParams: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const colorfulParams = this.util.inspect(optionalParams, { colors: true, depth: 10 })
    console.log(`------    ${this.name}  ${message}`, colorfulParams);
  };

  info = (message?: any, ...optionalParams: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const colorfulParams = this.util.inspect(optionalParams, { colors: true, depth: 8 })
    console.info(`------    ${this.name}  ${message}`, colorfulParams);
  };

  warn = (message?: any, ...optionalParams: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const colorfulParams = this.util.inspect(optionalParams, { colors: true, depth: 5 })
    console.warn(`------    ${this.name}  ${message}`, colorfulParams);
  };

  error = (error: unknown, ...optionalParams: any[]) => {
    const colorfulParams = this.util.inspect(optionalParams, { colors: true, depth: 3 })
    console.error(`------    ${this.name}  ${colorfulParams}`, colorfulParams);
  }
}

export const newLogger = (name: string) => new Logger(name);
