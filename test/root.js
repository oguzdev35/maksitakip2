const expect = require('chai').expect;
const Axios = require('axios').default;

const url = 'http://localhost:3000/';

describe('Testing the root path', () => {
    it('returns status 200', async () => {
        Axios({method: 'GET',url: url}).then( res => {
            expect(res.status()).equal(200);
            return;
        });
    });
});