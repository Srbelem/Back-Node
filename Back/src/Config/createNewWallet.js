const Wallet = require('../Model/WalletModel')
const Member = require('../Model/MemberModel')
class createNeWWallet {
    static async  create(){
        const  users = await Member.findAll()
        users.map(async function (user) {
            console.log(user.id)
        //      const walletIDSSUS = await Wallet.create({ uid: user.id, type: 12343, balance: 0 })
        //   const walletIDCSC = await Wallet.create({ uid: user.id, type: 12342, balance: 0 })
        // const walletIDSGC = await Wallet.create({ uid:user.id, type: 12341, balance: 0 })
        console.log("novas carteiras adicionadas")
        })
    }
}module.exports = createNeWWallet