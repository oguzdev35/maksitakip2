module.exports = {
    handleAxiosError: async (error) => {
        console.log(error)
        return error.response;
    }
}