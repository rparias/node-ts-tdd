import {LoginHandler} from "../../app/Handlers/LoginHandler";
import {HTTP_CODES, HTTP_METHODS} from "../../app/Models/ServerModels";
import {IncomingMessage, ServerResponse} from "http";
import {Authorizer} from "../../app/Authorization/Authorizer";


describe('LoginHandler test suite' , () => {
    let loginHandler: LoginHandler;

    const requestMock = {
        method: ''
    } as IncomingMessage;
    const responseMock = {
        writeHead: jest.fn()
    } as any;
    const authorizerMock = {} as Authorizer;

    beforeEach(() => {
        loginHandler = new LoginHandler(requestMock, responseMock, authorizerMock);
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
    })
})