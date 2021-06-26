import {Authorizer} from "../../app/Authorization/Authorizer";
import {SessionTokenDBAccess} from "../../app/Authorization/SessionTokenDBAccess";
import {UserCredentialsDbAccess} from "../../app/Authorization/UserCredentialsDbAccess";
// mock for modules or classes
jest.mock("../../app/Authorization/SessionTokenDBAccess");
jest.mock("../../app/Authorization/UserCredentialsDbAccess");

describe('Authorizer test suite', () => {
    let authorizer: Authorizer;

    test('constructor arguments', () => {
        new Authorizer();
        // para probar esto se necesita hacer un mock de las clases o modulos en los imports
        expect(SessionTokenDBAccess).toBeCalled();
        expect(UserCredentialsDbAccess).toBeCalled();
    });
})