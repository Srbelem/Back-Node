const Dagger = require('./Dagger')
const io = require('../index.js').io
//const SendEmail = require('../Controllers/SendEmailController')
const env = require('../Config/Env')
module.exports = async function (socket) {
    const filter = Dagger.events.Transfer({ room: 'latest' });
    filter.watch(async function(data, removed){
        console.log(data)
        socket.emit(`transferencia`,data)
        //const result = await SendEmail.sendMail(env.emailTo,env.nameTo,data.returnValues._value)
    });
}