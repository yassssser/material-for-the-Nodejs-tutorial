const jwt = require('jsonwebtoken')

module.exports = function (req, res, next){
    const token = req.header('x-auth-token')
    if(!token) return res.status(401).send('The token is not defined')

    try{
        const decoded = jwt.verify(token, 'project_jwtPrivetKey')
        req.user = decoded
        next()
    }catch(ex){
        res.status(400).send('Invlid token')
    }
}