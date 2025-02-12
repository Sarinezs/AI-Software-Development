
exports.getUser = async (req, res) => {
    try {
        const authheader = req.headers['authorization']
        let authtoken = ''
        if (authheader) {
            authtoken = authheader.split(' ')[1]
        }
        // console.log(authtoken)
        const user = jwt.verify(authtoken, secret)
        // console.log(user)
        const [results] = await conn.query('SELECT * FROM user')
        res.json({
            users: results
        })
    } catch (error) {
        console.log('error', error)
        res.status(403).json({
            message: 'authentication fail',
            error
        })
    }
}