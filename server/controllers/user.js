
const create = async (req, res) => {
    try {

        // const user = await User?.insertOne({
        //     "name": "Oğuz Kurttutan"
        // });

        // console.log(User)

        // res.status(200).json(User);

        console.log(global)
        res.json('ds')
        
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

module.exports = {
    create
}