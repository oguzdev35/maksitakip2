const Redis = require('ioredis');

const client =  new Redis({
    host: 'localhost',
    port: '6379'
});

module.exports = {
    client: client,
    disconnect: () => {
        client.disconnect();
    },
    set: async (prop, value) =>  {
        await client.set(prop, value);
    },
    unset: async (prop) => {
        await client.del(prop);
    }
}