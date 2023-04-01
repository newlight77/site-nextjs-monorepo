module.exports = {
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  modulePathIgnorePatterns: [
    "<rootDir>/test/__fixtures__",
    "<rootDir>/node_modules/",
    "<rootDir>/dist",
  ],
  preset: "ts-jest",
  roots: ["<rootDir>"],
  testEnvironment: "node",
  transform: {
    "^.+\\..(ts|tsx)?$": "ts-jest",
  },
  transformIgnorePatterns: ['node_modules/']
};
