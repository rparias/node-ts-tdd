module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        "^.+\\.(ts|js)$": "ts-jest"
    },
    testRegex: "(/__test__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
    verbose: true
}
