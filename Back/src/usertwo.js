const Ethereum = require('./Repositories/Ethereum')
const ethereum = new Ethereum()

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
    const balance = await ethereum.balance(usertwo.hash)
    console.log(balance)
    setTimeout(async () => {
       // const x = await ethereum.getGasPrice()
        //const transfer = await ethereum.transfer(usertwo, user.hash, balance, '1')
        const transfer = await ethereum.ExchangeTransferIDX(user.hash, 1, '60')
      //  console.log(x)
    }, 1000)
}
test()