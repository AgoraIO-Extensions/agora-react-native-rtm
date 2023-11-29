module.exports = {
  verbose: true,
  preset: 'react-native',
  silent: true,
  modulePathIgnorePatterns: [
    '<rootDir>/example/node_modules',
    '<rootDir>/lib/',
  ],
  testPathIgnorePatterns: ['<rootDir>/example/e2e'],
  setupFilesAfterEnv: ['./src/test/setup.ts'],
};
