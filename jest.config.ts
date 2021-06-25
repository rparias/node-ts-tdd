import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    roots: ['<rootDir>/src'],
    transform: {
        "^.+\\.(ts|js)$": "ts-jest"
    },
    testRegex: "(/__test__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/app/**/*.ts']
}

export default config;