const Ethereum = require('./Repositories/Ethereum')
const Bitcoin =  require('./Repositories/Bitcoin')
const Controlle=  require('./Controller/PriceController')
const ethereum = new Ethereum()
const bitcoin = new Bitcoin()

// setInterval(() => {
//     ethereum.postback('0x68c5F38cAA6B23BbA86EE3635dfa29f5166521A5')
// }, 7000)

const test = async () => {
    const user = {
        privatekey: '',
        hash: ''
    }
    const usertwo = {
        privatekey: '',
        hash: ''
    }

    const balance = await ethereum.balance(user.hash)
    setTimeout(async () => {
       // const x = await ethereum.fetchTaxes()
        console.log("balance",balance)
        const transfer = await ethereum.transfer(user, usertwo.hash, balance, '90')
        //const transfer = await ethereum.transfer(user, usertwo.hash, balance, '1')
        console.log(transfer)
    }, 1000)
}

const test2 = async () => {
    const wallet = await bitcoin.createAccount()
    console.log(wallet)
     
//    let a = await Controlle.getAllPrices()
//    console.log(a)
    // ethereum.postback()
}
test2()