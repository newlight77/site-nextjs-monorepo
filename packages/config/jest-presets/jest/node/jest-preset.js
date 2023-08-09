module.exports = {
  // collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    // "!src/index.ts",
    '!src/**/*.d.ts',
    "!src/**/*.types.ts",
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
    name: "library",
    color: "blueBright",
  },
  detectOpenHandles: true,
  forceExit: true,
  globalSetup: "jest-presets/jest/global.setup.js",
  // globalTeardown: "<rootDir>/src/tests/jest-globals-teardown.ts",
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: [ "js", "jsx", "json", "node", "ts"],
  modulePathIgnorePatterns: [
    "<rootDir>/test/__fixtures__",
    "<rootDir>/node_modules/",
    "<rootDir>/dist",
  ],
  preset: "ts-jest",
  roots: ["<rootDir>"],
  // setupFiles: ["dotenv/config"],
  // setupFilesAfterEnv: ['jest-presets/jest/node/test.setup.ts'],
  testEnvironment: "node",
  testMatch: [
    '**/__tests__/**/*.(spec|test).(js|ts)',
  ],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {
    '^.+\\.(gql|graphql)$': '@graphql-tools/jest-transform',
    "^.+\\.(ts|ts)?$": "ts-jest",
  },
  // transformIgnorePatterns: ['node_modules/'],
  transformIgnorePatterns: ["/node_modules/(?!(logger))"],
  verbose: true,
};
