import {LoginHandler} from "../../app/Handlers/LoginHandler";
import {Account, SessionToken, HTTP_CODES, HTTP_METHODS} from "../../app/Models/ServerModels";
import {IncomingMessage, ServerResponse} from "http";
import {Authorizer} from "../../app/Authorization/Authorizer";
import {Utils} from "../../app/Utils/Utils";

describe('LoginHandler test suite' , () => {
    let loginHandler: LoginHandler;

    const requestMock = {
        method: ''
    } as IncomingMessage;
    const responseMock = {
        writeHead: jest.fn(),
        write: jest.fn(),
        statusCode: 0
    } as any;
    const authorizerMock = {
        generateToken: jest.fn()
    } as any;
    const getRequestBodyMock = jest.fn();

    const someSessionToken: SessionToken = {
        tokenId: 'someTokenId',
        userName: 'someUserName',
        valid: true,
        expirationTime: new Date(),
        accessRights: [1, 2, 3]
    };


    beforeEach(() => {
        loginHandler = new LoginHandler(requestMock, responseMock, authorizerMock);
        Utils.getRequestBody = getRequestBodyMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('options request', async () => {
        requestMock.method = HTTP_METHODS.OPTIONS;
        await loginHandler.handleRequest();
        expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK);
    });

    test('not handled http method', async () => {
        requestMock.method = 'WhateverMethod';
        await loginHandler.handleRequest();
        expect(responseMock.writeHead).not.toHaveBeenCalled();
    });

    test.only('post request with valid login', async () => {
        requestMock.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockReturnValueOnce({
            username: 'user',
            password: 'pass'
        } as Account);
        authorizerMock.generateToken.mockReturnValueOnce(someSessionToken);

        await loginHandler.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' })
        expect(responseMock.write).toBeCalledWith(JSON.stringify(someSessionToken));
    });
})