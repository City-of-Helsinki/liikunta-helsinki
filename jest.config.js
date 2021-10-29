module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transform: {
    // if we would use .babelrc, next would not use swc compiler
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { "configFile": "./babel.config.test.json" }],
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    "^.+\\.(jpg|jpeg|png|gif|webp|svg)$": `<rootDir>/.jest/__mocks__/fileMock.js`,
  },
  coveragePathIgnorePatterns: ["<rootDir>/src/tests/", "<rootDir>/.jest/"],
};
