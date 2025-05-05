const mongoService = require('./database')
const sendMail = require('./mail')
const socketService = require('../routes/socket')

module.exports ={
    mongoService,
    sendMail,
    socketService
}