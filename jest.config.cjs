/** @type {import("jest").Config} **/
module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: [
        './jest.setup.js'
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFiles: ['<rootDir>/jest.setup.js'],
    collectCoverageFrom: [
        'app/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'contexts/**/*.{ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
    testMatch: [
        '**/__tests__/**/*.(test|spec).(ts|tsx|js)',
        '**/*.(test|spec).(ts|tsx|js)'
    ],
    verbose: true,
};