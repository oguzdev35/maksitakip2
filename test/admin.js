const expect = require('chai').expect;
const {handleAxiosError} = require('./utility/error.handle'); 
const Axios = require('./utility/axios');
const createHeader = require('./utility/create_header');
const redis = require('./utility/redis');

describe('Testing Admin Profile Management', () => {
    let response = undefined;
    describe('creating admin profile', () => {
        before( async () => {
            response = await Axios({method: 'POST',url: '/api/admin', data: {
                "name": "Admin",
                "password": "123456",
                "username": "admin",
                "email": "admin@maksisoft.com",
                "api_root_key": "1234567890"
            }}).catch(handleAxiosError);
            await redis.set('admin', {
                ...response.data,
                passwod: '123456'
            });
        })
        it('should returns status 200', async () => {expect(response.status).equal(200);});
    });

    describe('not able to create more then one admin profile', () => {
        before( async () => {
            response = await Axios({method: 'POST',url: '/api/admin', data: {
                "name": "Admin",
                "password": "123456",
                "username": "admin",
                "email": "admin@maksisoft.com",
                "api_root_key": "1234567890"
            }}).catch(handleAxiosError);
        })
        it('should returns status 403', async () => {expect(response.status).equal(403);});
    });
    
})


