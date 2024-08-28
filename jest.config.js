const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/tests/**/*.test.js', '<rootDir>/tests/**/*.test.jsx', '<rootDir>/tests/**/*.test.ts', '<rootDir>/tests/**/*.test.tsx'],
};

module.exports = createJestConfig(customJestConfig);