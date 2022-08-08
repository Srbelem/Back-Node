const Sequelize = require('sequelize')
const config = require('../Config/bd')

const Member = require('../Model/MemberModel')
const Token = require('../Model/TokenModel')
const Wallet = require('../Model/WalletModel')
const Order = require('../Model/OrderModel')
const Transaction = require('../Model/TransactionModel')
const Price = require('../Model/PriceModel')
const Payment = require('../Model/PaymentModel')
const Withdraw = require('../Model/WithdrawModel')
const WithdrawFiat = require('../Model/WithdrawFiatModel')
const InternTransfer = require('../Model/InternTransferModel')
const AccountBank = require('../Model/AccountBankModel')
const Bank = require('../Model/BanksModel')
const Pix = require('../Model/PixModel')
const GasPrice = require('../Model/GasPriceModel')
const UmbrelaPrice = require('../Model/UmbrellaPriceModel')
const Documents = require('../Model/DocumentsModel')
const UmbrellaInfo =require('../Model/UmbrellaInfoModel')
const StatusVip =require('../Model/StatusVipModel')
const ExTransfer =require('../Model/ExTransferModel')
const PriceMarket = require('../Model/PriceMarketModel')
const connection = new Sequelize(config)

async function conect() {
    try {
        await connection.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
conect()
Member.init(connection)
Token.init(connection)
Order.init(connection)
Transaction.init(connection)
Wallet.init(connection)
Price.init(connection)
Payment.init(connection)
Withdraw.init(connection)
WithdrawFiat.init(connection)
InternTransfer.init(connection)
AccountBank.init(connection)
Bank.init(connection)
Pix.init(connection)
GasPrice.init(connection)
UmbrelaPrice.init(connection)
Member.init(connection)
Documents.init(connection)
UmbrellaInfo.init(connection)
UmbrellaInfo.init(connection)
StatusVip.init(connection)
ExTransfer.init(connection)
PriceMarket.init(connection)

Member.associate(connection.models)
Token.associate(connection.models)
Order.associate(connection.models)
Transaction.associate(connection.models)
Wallet.associate(connection.models)
Payment.associate(connection.models)
Withdraw.associate(connection.models)
WithdrawFiat.associate(connection.models)
InternTransfer.associate(connection.models)
ExTransfer.associate(connection.models)

module.exports = connection
