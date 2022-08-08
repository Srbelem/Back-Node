const Payment = require('../Model/PaymentModel')
module.exports = async ()=>{
    let id=0
    while(true){
        id = Math.floor(Math.random() * 100000)
        const pay = await Payment.findOne({where:{code:id}})
        if(!pay){
            break
        }
    }
    return id
}