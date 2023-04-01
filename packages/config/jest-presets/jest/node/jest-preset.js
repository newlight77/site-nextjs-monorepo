module.exports = {
  roots: ["<rootDir>"],
  transform: {
    "^.+\\..(ts|tsx)?$": "ts-jest",
  },
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
};
