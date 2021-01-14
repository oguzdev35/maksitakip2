const { networkInterfaces } = require('os')

const getLocalExternalIP = () => [].concat(...Object.values(networkInterfaces()))
  .filter(details => details.family === 'IPv4' && !details.internal)
  .pop().address

module.exports = {
    getLocalExternalIP
}