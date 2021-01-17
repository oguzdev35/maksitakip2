const expect = require('chai').expect;
const {handleAxiosError} = require('./utility/error.handle'); 
const Axios = require('./utility/axios');
const createHeader = require('./utility/create_header');
const redis = require('./utility/redis');
const faker = require('faker');


let fakePersonals = Array(faker.random.number({min: 1, max: 5})).fill({}).map( item => ({
    name: faker.lorem.words(2),
    username: faker.lorem.word(10),
    email: faker.internet.email(),
    passwod: faker.lorem.word(12),
}));



describe('Testing Company-Personal Management', async () => {
    let auth = await redis.get('auth');

    await describe('creating multiple number of personal', () => {
        fakePersonals.forEach( (personalData, idx) => {
            describe(`creating ${idx + 1}. personal.`, () => {
                let response = undefined;
                before( async () => {
                    response = await Axios({method: 'POST', url: '/api/company/personal', data: personalData, headers: createHeader(auth.token)}).catch(handleAxiosError);
                })
                it('should return status 200', async () => {
                    expect(response.status).equal(200);
                });
            });
        });
    })

})


