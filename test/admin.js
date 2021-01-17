const expect = require('chai').expect;
const {handleAxiosError} = require('./utility/error.handle'); 
const Axios = require('./utility/axios');
const createHeader = require('./utility/create_header');
const redis = require('./utility/redis');

describe('Testing Admin Profile Management', async () => {
    let response = undefined;
    await describe('creating admin profile', () => {
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

    await describe('not able to create more then one admin profile', () => {
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

    await describe('the admin profile logging in to the system', () => {
        before( async () => {
            response = await Axios({method: 'POST',url: '/api/auth/signin', data: {
                "password": "123456",
                "username": "admin",
            }}).catch(handleAxiosError);
            await redis.set('auth',response.data);
        })
        it('should returns status 200', async () => {expect(response.status).equal(200);});
    });
    
})


