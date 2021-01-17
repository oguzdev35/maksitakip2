const expect = require('chai').expect;
const {handleAxiosError} = require('./utility/error.handle'); 
const Axios = require('./utility/axios');
const createHeader = require('./utility/create_header');

describe('Testing the root path', () => {
    it('returns status 200', async () => {
        return await Axios({method: 'GET',url: '/'}).then( res => {
            expect(res.status).equal(200);
            
        }).catch(handleAxiosError);
    });
});

