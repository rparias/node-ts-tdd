import {SessionTokenDBAccess} from "../../app/Authorization/SessionTokenDBAccess";
import * as Nedb from 'nedb';
import {SessionToken} from "../../app/Models/ServerModels";
jest.mock('nedb');

describe('SessionTokenDBAccess', () => {
    let sessionTokenDBAccess: SessionTokenDBAccess;

    const nedbMock = {
        loadDatabase: jest.fn(),
        insert: jest.fn(),
        find: jest.fn()
    } as any;

    beforeEach(() => {
        sessionTokenDBAccess = new SessionTokenDBAccess(nedbMock);
        expect(nedbMock.loadDatabase).toBeCalled();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const someToken: SessionToken = {
        accessRights: [],
        expirationTime: new Date(),
        tokenId: 'tokenId',
        userName: 'John',
        valid: true
    };

    test('constructor argument call', async () => {
        new SessionTokenDBAccess();
        expect(Nedb).toBeCalledWith('databases/sessionToken.db');
    });

    test('store sessionToken without error', async () => {
        // para este tipo de tests se necesita mockear la implementacion
        nedbMock.insert.mockImplementationOnce(
            (token: any, cb: any) => {
                cb();
            }
        );

        await sessionTokenDBAccess.storeSessionToken(someToken);

        expect(nedbMock.insert).toBeCalledWith(someToken, expect.any(Function));
    });

    test('store sessionToken with error', async () => {
        nedbMock.insert.mockImplementationOnce(
            (token: any, cb: any) => {
                cb(new Error('something went wrong!'));
            }
        );

        await expect(sessionTokenDBAccess.storeSessionToken(someToken)).rejects.toThrow('something went wrong!');

        expect(nedbMock.insert).toBeCalledWith(someToken, expect.any(Function));
    });

    test('get token with result and no error', async () => {
        nedbMock.find.mockImplementationOnce(
            (query: any, cb: any) => {
                cb(null, [someToken]);
            }
        );
        const someTokenId = '123';

        const resultToken = await sessionTokenDBAccess.getToken(someTokenId);

        expect(resultToken).toBe(someToken);
        expect(nedbMock.find).toBeCalledWith({tokenId: someTokenId}, expect.any(Function));
    });

    test('get token with no result and no error', async () => {
        nedbMock.find.mockImplementationOnce(
            (query: any, cb: any) => {
                cb(null, []);
            }
        );
        const someTokenId = '123';

        const resultToken = await sessionTokenDBAccess.getToken(someTokenId);

        expect(resultToken).toBe(undefined);
        expect(nedbMock.find).toBeCalledWith({tokenId: someTokenId}, expect.any(Function));
    });

    test('get token with error', async () => {
        nedbMock.find.mockImplementationOnce(
            (query: any, cb: any) => {
                cb(new Error('something went wrong!'), null);
            }
        );

        await expect(sessionTokenDBAccess.getToken('123')).rejects.toThrow('something went wrong!');
        expect(nedbMock.find).toBeCalledWith({tokenId: '123'}, expect.any(Function));
    });
})