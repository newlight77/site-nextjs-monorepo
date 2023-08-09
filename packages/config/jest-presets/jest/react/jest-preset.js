module.exports = {
  // collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    // "!src/index.tsx",
    '!src/**/*.d.ts',
    "!src/**/*.types.ts",
    '!**/*.styles.tsx',
    '!**/*.stories.*',
    '!**/__tests__/**',
    '!**/__fixtures__/**',
    '!**/__generated__/**',
  ],
  coverageThreshold: {
    "global": {
      "branches": 0,
      "functions": 0,
      "lines": 0,
      "statements": 0
    }
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov'],
  displayName: {
    name: "site nextjs",
    color: "greenBright",
  },
  detectOpenHandles: true,
  forceExit: true,
  globalSetup: "jest-presets/jest/global.setup.js",
  // globalTeardown: "<rootDir>/src/tests/jest-globals-teardown.ts",
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  modulePathIgnorePatterns: [
    "<rootDir>/test/__fixtures__",
    "<rootDir>/node_modules/",
    "<rootDir>/dist",
  ],
  preset: 'ts-jest/presets/js-with-babel',
  roots: ["<rootDir>"],
  // setupFiles: ["dotenv/config"],
  // setupFilesAfterEnv: ['jest-presets/jest/node/test.setup.ts'],
  testEnvironment: 'jsdom',
  testMatch: [
    '**/*.(spec|test).(js|jsx|ts|tsx)'
  ],
  testPathIgnorePatterns: ["/node_modules/"],
  // testRegex: "((\\.|/*.)(spec))\\.js?$",
  transform: {
    '^.+\\.(gql|graphql)$': '@graphql-tools/jest-transform',
    "^.+\\.(ts|tsx)?$": "ts-jest",
    '^.+\\.?styles\\.tsx?$': 'babel-jest',
    '^.+(?!\\styles)\\.tsx?$': 'ts-jest'
  },
  transformIgnorePatterns: ['node_modules/'],
  verbose: true,
};
