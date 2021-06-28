import * as axios from 'axios';
import {HTTP_CODES, SessionToken, UserCredentials} from "../app/Models/ServerModels";
import {UserCredentialsDbAccess} from "../app/Authorization/UserCredentialsDbAccess";

axios.default.defaults.validateStatus = function () {
    return true;
}
const serverUrl = 'http://localhost:8080';
const iTestUserCredentials: UserCredentials = {
    accessRights: [1,2,3],
    password: 'iTestPassword',
    username: 'iTestUsername'
}

describe('Server integration test suite', () => {

    let userCredentialsDBAccess: UserCredentialsDbAccess;
    let sessionToken: SessionToken;

    beforeAll(() => {
        userCredentialsDBAccess = new UserCredentialsDbAccess();
    });

    // this test passes only if server is running
    test('server reachable', async () => {
        const response = await axios.default.options(serverUrl);
        expect(response.status).toBe(HTTP_CODES.OK);
    });

    test('put credentials inside database', async () => {
        await userCredentialsDBAccess.putUserCredential(iTestUserCredentials);
    });

    test('reject invalid credentials', async () => {
        const response = await axios.default.post(
            (serverUrl + '/login'),
            {
                'username': 'someWrongCred',
                'password': 'someWrongCred'
            }
        );
        expect(response.status).toBe(HTTP_CODES.NOT_fOUND);
    });

    test.skip('login successful with correct credentials', async () => {
        const response = await axios.default.post(
            (serverUrl + '/login'),
            {
                'username': iTestUserCredentials.username,
                'password': iTestUserCredentials.password
            }
        );
        expect(response.status).toBe(HTTP_CODES.CREATED);
        sessionToken = response.data;
    });

    test.skip('query data user', async () => {
        const response = await axios.default.get(
            (serverUrl + '/users?name=some'), {
                headers: {
                    Authorization: sessionToken.tokenId
                }
            }
        );
        expect(response.status).toBe(HTTP_CODES.OK);
    });

    test.skip('query data user with invalid token', async () => {
        const response = await axios.default.get(
            (serverUrl + '/users?name=some'), {
                headers: {
                    Authorization: sessionToken.tokenId + 'some'
                }
            }
        );
        expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED);
    });
})