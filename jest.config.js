module.exports = {
  setupFilesAfterEnv: ['<rootDir>/test-setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
  },
  moduleFileExtensions: ['js', 'jsx', 'json'],
  transform: {
    '.jsx?$': 'babel-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.*'],
};
