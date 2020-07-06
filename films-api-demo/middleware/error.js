const winston = require('winston')

module.exports = function(err, req, res, next){
    // log errors and exeption
        // level of winston :
            // error
            // warn
            // info
            // verbose
            // debug
            // silly
    winston.error(err.message, err.timestamp)
    
    res.status(500).send('Something went wrong')
}