
class Logger {
  log = (message?: any, ...optionalParams: any[]) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const colorfulParams = require('util').inspect(optionalParams, { colors: true, depth: 5 })
      console.log(`------    NotionService  ${message}`, colorfulParams);
  };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    log_ = (message?: any, ...optionalParams: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const colorfulParams = optionalParams;
  };

  error = (error: unknown, ...optionalParams: any[]) => this.log(error, optionalParams);
}


export const logger = new Logger();
