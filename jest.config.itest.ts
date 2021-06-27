import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    roots: ['<rootDir>/src/integration'],
    transform: {
        "^.+\\.(ts|js)$": "ts-jest"
    },
    testRegex: "(/__test__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
    verbose: true,
    testEnvironment: "node"
}

export default config;