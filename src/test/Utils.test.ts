import {Utils} from "../app/Utils";

describe('Utils test suite', () => {

    test('first test', () => {
        const result = Utils.toUpperCase('abc');
        expect(result).toBe('ABC');
    });

    test('parse simple URL', () => {
        const parsedUrl = Utils.parseUrl('http://localhost:8080/login');
        expect(parsedUrl.href).toBe('http://localhost:8080/login');
        expect(parsedUrl.port).toBe('8080');
        expect(parsedUrl.protocol).toBe('http:');
        expect(parsedUrl.query).toEqual({}); // toEqual is for objects, and toBe is for primitive values
    });

    test('parse URL with query', () => {
        const expectedQuery = {
            user: 'user',
            password: 'pass'
        }
        const parsedUrl = Utils.parseUrl('http://localhost:8080/login?user=user&password=pass');
        expect(parsedUrl.query).toEqual(expectedQuery);
    });

    test('test invalid URL', () => {
        function expectError() {
            Utils.parseUrl('');
        }
        expect(expectError).toThrowError('Empty URL!');
    });

    test('test invalid URL with arrow function', () => {
        expect(() => {
            Utils.parseUrl('')
        }).toThrowError('Empty URL!');
    });

    test('test invalid URL with try catch', () => {
        try {
            Utils.parseUrl('');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Empty URL!');
        }
    });

});