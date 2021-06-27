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
})