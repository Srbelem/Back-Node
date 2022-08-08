const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require("path");

const user = require('./Router/UserRouter')
const login = require('./Router/LoginRouter')
const price = require('./Router/PriceRouter')
const order = require('./Router/OrderRouter')
const wallet = require('./Router/WalletRouter')
const payment = require('./Router/PaymentRouter')
const betting_history = require('./Router/Betting_historyRouter')
const ethereum = require('./Router/EthereumRouter')
const withdraw = require('./Router/WithdrawRouter')
const withdrawfiat = require('./Router/WithdrawFiatRouter')
const interntransfer = require('./Router/InternTrasnferRouter')
const accountBank = require('./Router/AccountBankRouter')
const documents = require('./Router/DocumentsRouter')


const  PriceController = require('./Controller/PriceController')
const Ethereum = require('./Repositories/Ethereum')
const ethereumRepo = new Ethereum()

require('./DataBase/index')
app.use(cors());
app.use(bodyParser.json());
app.use('/user',user)
app.use('/',login)
app.use('/banks',accountBank)
app.use('/price', price)
app.use('/order',order)
app.use('/wallet',wallet)
app.use('/payment',payment)
app.use('/betting_history',betting_history)
app.use('/ethereum',ethereum)
app.use('/withdraw',withdraw)
app.use('/withdrawfiat',withdrawfiat)
app.use('/interntransfer',interntransfer)
app.use('/documents',documents)
app.use(
  "/files",
   express.static(path.resolve(__dirname,"..", "documents","upload"))
);
app.use(
  "/image",
   express.static(path.resolve(__dirname,"..", "Image","profile"))
);
  // express.static(path.resolve(__dirname,"..", "documents","10202817407","toDepend"))

setInterval(async () => {
  await PriceController.refreshPrices()
  PriceController.refreshGasPrices()

}, 30000)
// setInterval(() => {
//   ethereumRepo.postback()
// }, 900000)

// setInterval(async () => {
//   ethereumRepo.postback()
// }, 60000)
const port = process.env.PORT || 4100;
app.listen(port, function () {
  console.log("Servidor iniciado na porta", port);
})