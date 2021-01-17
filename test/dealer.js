const expect = require('chai').expect;
const {handleAxiosError} = require('./utility/error.handle'); 
const Axios = require('./utility/axios');
const createHeader = require('./utility/create_header');
const redis = require('./utility/redis');
const faker = require('faker');


let fakeDealers = Array(faker.random.number({min: 1, max: 5})).fill({}).map( item => ({
    name: faker.lorem.words(2),
    info: faker.lorem.words(10),
}));



describe('Testing Company-Dealer Management', async () => {
    let auth = await redis.get('auth');

    await describe('creating multiple number of dealer', () => {
        fakeDealers.forEach( (dealerData, idx) => {
            describe(`creating ${idx + 1}. dealer.`, () => {
                let response = undefined;
                before( async () => {
                    response = await Axios({method: 'POST', url: '/api/company/dealer', data: dealerData, headers: createHeader(auth.token)}).catch(handleAxiosError);
                })
                it('should return status 200', async () => {
                    expect(response.status).equal(200);
                });
            });
        });
    })

})


