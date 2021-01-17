module.exports = {
    handleAxiosError: async (error) => {
        return error.response;
    }
}