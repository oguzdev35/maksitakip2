const Axios = require('axios').default;

Axios.defaults.baseURL = 'http://localhost:3000/';
Axios.defaults.headers.common['Content-Type'] = 'application/json';

module.exports = Axios;