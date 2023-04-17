
export enum LogLevel {
  DEBUG,
  LOG,
  INFO,
  WARN,
  ERROR,
  NONE
}

class Logger {
  private util = require('util');
  private color = new Color();
  private level = LogLevel.INFO;

  constructor(private name: string, level?: LogLevel) {
    this.level = level ? level : LogLevel.INFO;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  noOp = (message?: any, ...optionalParams: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const colorfulParams = optionalParams;
  };

  debug = (message?: any, ...optionalParams: any[]) => {
    if (this.level > LogLevel.DEBUG) return
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const colorfulParams = this.util.inspect(optionalParams, { colors: true, depth: 20 })
    console.debug(`${new Date().toLocaleString()} ${this.color.greenH('-DEBUG-', true, true)}    ${this.color.green(this.name, true)}  ${message}`, colorfulParams);
  };

  log = (message?: any, ...optionalParams: any[]) => {
    if (this.level > LogLevel.LOG) return
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const colorfulParams = this.util.inspect(optionalParams, { colors: true, depth: 10 })
    console.log(`${new Date().toLocaleString()} ${this.color.blueH('-LOG---', true, true)}    ${this.color.blue(this.name, true)}  ${message}`, colorfulParams);
  };

  info = (message?: any, ...optionalParams: any[]) => {
    if (this.level > LogLevel.INFO) return
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const colorfulParams = this.util.inspect(optionalParams, { colors: true, depth: 8 })
    console.info(`${new Date().toLocaleString()} ${this.color.whiteH('-INFO--', true, true)}    ${this.color.white(this.name, true)}  ${message}`, colorfulParams);
  };

  warn = (message?: any, ...optionalParams: any[]) => {
    if (this.level > LogLevel.WARN) return
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const colorfulParams = this.util.inspect(optionalParams, { colors: true, depth: 5 })
    console.warn(`${new Date().toLocaleString()} ${this.color.yellowH('-WARN--', true, true)}    ${this.color.yellow(this.name, true)}  ${message}`, colorfulParams);
  };

  error = (message: unknown, ...optionalParams: any[]) => {
    if (this.level > LogLevel.ERROR) return
    const colorfulParams = this.util.inspect(optionalParams, { colors: true, depth: 3 })
    console.error(`${new Date().toLocaleString()} ${this.color.redH('-ERROR-', true, true)}    ${this.color.red(this.name, true)}  ${message}`, colorfulParams);
  }
}

class Color {
  private util = require('util');

  colorize = (text: string, color: string, bg?: string, bold?: boolean): string => {
    const codes = this.util.inspect.colors[color];
    const bgCodes = this.util.inspect.colors[bg ? bg : ''];
    const boldCodes = this.util.inspect.colors['bold'];

    let output = `\x1b[${codes[0]}m${text}\x1b[${codes[1]}m`;
    if (bgCodes !== undefined) output = `\x1b[${bgCodes[0]}m${output}\x1b[${bgCodes[1]}m`;
    if (bold === true) output = `\x1b[${boldCodes[0]}m${output}\x1b[${boldCodes[1]}m`;
    output = `${output}\x1b[0m`;

    return output;
  }

  green = (text: string, bold?: boolean): any => this.colorize(text, 'green', undefined, bold);
  blue = (text: string, bold?: boolean): any => this.colorize(text, 'blue', undefined, bold);
  white = (text: string, bold?: boolean): any => this.colorize(text, 'white', undefined, bold);
  yellow = (text: string, bold?: boolean): any => this.colorize(text, 'yellow', undefined, bold);
  red = (text: string, bold?: boolean): any => this.colorize(text, 'red', undefined, bold);

  greenH = (text: string, highlight?: boolean, bold?: boolean): any => this.colorize(text, 'green', highlight ? 'bgWhiteBright': undefined, bold);
  blueH = (text: string, highlight?: boolean, bold?: boolean): any => this.colorize(text, 'blue', highlight ? 'bgWhiteBright': undefined, bold);
  whiteH = (text: string, highlight?: boolean, bold?: boolean): any => this.colorize(text, 'white', highlight ? 'bgGray': undefined, bold);
  yellowH = (text: string, highlight?: boolean, bold?: boolean): any => this.colorize(text, 'yellow', highlight ? 'bgWhite': undefined, bold);
  redH = (text: string, highlight?: boolean, bold?: boolean): any => this.colorize(text, 'red', highlight ? 'bgWhite': undefined, bold);
}

export const newLogger = (name: string, level?: LogLevel) => new Logger(name, level);







// eslint-disable-next-line @typescript-eslint/no-unused-vars
const COLOR_CODES = {
  reset: [0, 0],

  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  blink: [5, 25],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],
  doubleunderline: [21, 24],

  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  framed: [51, 54],
  overlined: [53, 55],
  gray: [90, 39],

  redBright: [91, 39],
  greenBright: [92, 39],
  yellowBright: [93, 39],
  blueBright: [94, 39],
  magentaBright: [95, 39],
  cyanBright: [96, 39],
  whiteBright: [97, 39],

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  bgGray: [100, 49],
  bgRedBright: [101, 49],
  bgGreenBright: [102, 49],
  bgYellowBright: [103, 49],
  bgBlueBright: [104, 49],
  bgMagentaBright: [105, 49],
  bgCyanBright: [106, 49],
  bgWhiteBright: [107, 49]
}
