import * as axios from 'axios';

axios.default.defaults.validateStatus = function () {
    return true;
}
const serverUrl = 'http://localhost:8080';

describe('Server integration test suite', () => {

    // correr o hacer skip de una prueba de forma condicional:
    // un describe no puede ser async, por lo tanto, la siguiente linea solo funciona con metodos no asynchronous
    // const testIfServerReachable = await serverReachable() ? test: test.skip;

    test('server reachable', async () => {
        await serverReachable();
    });
})

async function serverReachable(): Promise<boolean> {
    try {
        await axios.default.get(serverUrl);
    } catch (error) {
        console.log('Server not reachable');
        return false;
    }
    return true;
}