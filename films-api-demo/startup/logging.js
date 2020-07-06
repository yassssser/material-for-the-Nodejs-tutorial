const winston = require('winston')
// require('winston-mongodb')
require('express-async-errors')

module.exports = function(){

    // process.on('uncaughtException', (ex) => {
    //     winston.error(ex.message, ex)
    //     process.exit(1)
    //   })
      
      winston.handleExceptions(
        new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
        new winston.transports.Console({ colorize: true, prettyPrint: true })
      )
      
      process.on('unhandledRejection', (ex) => {
        // winston.error(ex.message, ex)
        // process.exit(1)
        throw ex
      })
      
      winston.add(winston.transports.File, { filename: 'logfile.log' })
      // winston.add(winston.transports.MongoDB, { 
      //   'db': 'mongodb://localhost/films',
      //   'level': 'error'
      // })
      
}