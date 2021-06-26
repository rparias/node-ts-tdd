import {DataHandler} from "../../app/Handlers/DataHandler";
import {IncomingMessage} from "http";
import {AccessRight, HTTP_CODES, HTTP_METHODS, TokenRights, TokenState} from "../../app/Models/ServerModels";
import {Utils} from "../../app/Utils/Utils";
import {User, WorkingPosition} from "../../app/Models/UserModels";

describe('DataHandler test suite', () => {

    let dataHandler: DataHandler;

    const requestMock = {
        method: '',
        headers: {
            authorization: ''
        },
        statusCode: 0
    } as IncomingMessage;
    const responseMock = {
        writeHead: jest.fn(),
        write: jest.fn()
    } as any;
    const tokenValidatorMock = {
        validateToken: jest.fn()
    } as any;
    const usersDBAccessMock = {
        getUsersByName: jest.fn()
    } as any;
    const parseUrlMock = jest.fn();

    const someTokenRights: TokenRights = {
        accessRights: [AccessRight.READ],
        state: TokenState.VALID
    }

    const someParcedUrl = {
        query: {
            name: 'someQuery'
        }
    };

    const someUsers: User[] = [{id: 'userId', name: 'userName', age: 18, email: 'user@test.com', workingPosition: WorkingPosition.ENGINEER}];

    beforeEach(() => {
        dataHandler = new DataHandler(requestMock, responseMock, tokenValidatorMock, usersDBAccessMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    test('handle request with options', async () => {
        requestMock.method = HTTP_METHODS.OPTIONS;

        await dataHandler.handleRequest();

        expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK);
    });

    test('handle get request for an authorized operation with valid tokenId', async () => {
        requestMock.method = HTTP_METHODS.GET;
        requestMock.headers.authorization = 'someTokenId';
        tokenValidatorMock.validateToken.mockReturnValueOnce(someTokenRights);
        Utils.parseUrl = parseUrlMock;
        parseUrlMock.mockReturnValueOnce(someParcedUrl);
        usersDBAccessMock.getUsersByName.mockReturnValueOnce(someUsers);

        await dataHandler.handleRequest();

        expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK, {'Content-Type': 'application/json'});
        expect(responseMock.write).toBeCalledWith(JSON.stringify(someUsers));
    });

    test('handle get request for an authorized operation with invalid query name', async () => {
        requestMock.method = HTTP_METHODS.GET;
        requestMock.headers.authorization = 'someTokenId';
        tokenValidatorMock.validateToken.mockReturnValueOnce(someTokenRights);
        Utils.parseUrl = parseUrlMock;
        const invalidQueryName = someParcedUrl;
        invalidQueryName.query.name = null;
        parseUrlMock.mockReturnValueOnce(invalidQueryName);

        await dataHandler.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseMock.write).toBeCalledWith('Missing name parameter in the request!');
    });

    test('handle get request for an unauthorized operation', async () => {
        requestMock.method = HTTP_METHODS.GET;
        requestMock.headers.authorization = null;

        await dataHandler.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        expect(responseMock.write).toBeCalledWith('Unauthorized operation!');
    });

    test('handle get request when error occurs', async () => {
        requestMock.method = HTTP_METHODS.GET;
        requestMock.headers.authorization = 'someTokenId';
        tokenValidatorMock.validateToken.mockRejectedValueOnce(new Error('something went wrong!'));

        await dataHandler.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
        expect(responseMock.write).toBeCalledWith('Internal error: something went wrong!');
    });
})