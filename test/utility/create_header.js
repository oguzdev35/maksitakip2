module.exports = (token) => {
    return ({
        'Authorization': 'Bearer ' + token
    })
}