module.exports = {
    handleAxiosError: async (error) => {
        throw new Error(error.message);
    }
}