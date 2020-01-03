module.exports = {
  setupFilesAfterEnv: ['<rootDir>/test-setup.js'],
  transform: {
    '.jsx?$': 'babel-jest',
  },
};
