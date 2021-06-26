import {Authorizer} from "../../app/Authorization/Authorizer";
import {SessionTokenDBAccess} from "../../app/Authorization/SessionTokenDBAccess";
import {UserCredentialsDbAccess} from "../../app/Authorization/UserCredentialsDbAccess";
import {Account, SessionToken} from "../../app/Models/ServerModels";
// mock for modules or classes
jest.mock("../../app/Authorization/SessionTokenDBAccess");
jest.mock("../../app/Authorization/UserCredentialsDbAccess");

describe('Authorizer test suite', () => {
    let authorizer: Authorizer;

    const sessionTokenDBAccess = {
        storeSessionToken: jest.fn()
    } as any;
    const userCredentialsDBAccess = {
        getUserCredential: jest.fn()
    } as any;

    const someAccount: Account = {
        username: 'someUser',
        password: 'somePassword'
    };

    beforeEach(() => {
        authorizer = new Authorizer(sessionTokenDBAccess, userCredentialsDBAccess);
    });

    test('constructor arguments', () => {
        new Authorizer();
        // para probar esto se necesita hacer un mock de las clases o modulos en los imports
        expect(SessionTokenDBAccess).toBeCalled();
        expect(UserCredentialsDbAccess).toBeCalled();
    });

    test('should return sessionToken for valid credentials', async () => {
        userCredentialsDBAccess.getUserCredential.mockReturnValueOnce({
            username: 'someUser',
            accessRights: [1,2,3]
        });
        const expectedSessionToken: SessionToken = {
            accessRights: [1,2,3],
            expirationTime: new Date(60*60*1000),
            userName: 'someUser',
            valid: true,
            tokenId: ''
        };
        // con spies puedo ver lo que hace el metodo now o random y mockear sus valores
        jest.spyOn(global.Date, "now").mockReturnValueOnce(0);
        jest.spyOn(global.Math, "random").mockReturnValueOnce(0);

        const sessionToken = await authorizer.generateToken(someAccount);

        expect(sessionTokenDBAccess.storeSessionToken).toBeCalledWith(sessionToken);
        expect(sessionToken).toEqual(expectedSessionToken);
    });
})