module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['**/*.(t|j)s', '!**/node_modules/**', '!dist/**', '!coverage/**'],
  coverageDirectory: './coverage',
  coverageReporters: ['json', 'html'],
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: {
        target: 'ES6',
      },
    },
  },
};
