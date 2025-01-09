const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': './src/components/$1',
    '^@/store/(.*)$': './src/store/$1',
    '^@/hooks/(.*)$': './src/hooks/$1',
  },
};

module.exports = createJestConfig(customJestConfig);