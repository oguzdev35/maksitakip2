const Axios = require('axios').default;

Axios.defaults.baseURL = 'http://127.0.0.1:3000/';
Axios.defaults.headers.common['Content-Type'] = 'application/json';
Axios.defaults.timeout = 1 * 1000;

module.exports = Axios;