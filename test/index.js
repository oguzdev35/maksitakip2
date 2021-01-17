const expect = require('chai').expect;
const {handleAxiosError} = require('./utility/error.handle'); 
const Axios = require('./utility/axios');
const createHeader = require('./utility/create_header');

describe('Testing the root path', () => {
    let result = undefined;
    before( async () => {
        result = await Axios({method: 'GET',url: '/'}).catch(handleAxiosError);
    })
    it('returns status 200', async () => {expect(result.status).equal(200);});
});

