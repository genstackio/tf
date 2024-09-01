import type { Config } from 'jest';

export default (): Config => ({
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.spec.ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    modulePaths: ['<rootDir>'],
    moduleNameMapper: {
        '~(.*)$': '<rootDir>/$1',
        "\\.css$": "identity-obj-proxy",
        "\\.(ttf|eot|svg)": "identity-obj-proxy",
        "^lodash-es$": "lodash"
    },
    moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
    reporters: ['default', ['jest-junit', { outputDirectory: 'coverage' }]],
    roots: ['test'],
    collectCoverage: true,
    clearMocks: true,
    automock: false,
    coverageReporters: ['html', 'lcov'],
    coverageDirectory: '<rootDir>/coverage',
    collectCoverageFrom: [
        'src/{*,**/*}.{js,ts}',
    ],
});
