const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
const app = express();

const user = require('./Router/UserRouter')
const login = require('./Router/LoginRouter')
const price = require('./Router/PriceRouter')
const jogos = require('./Router/JogosRouter')
const order = require('./Router/OrderRouter')
const wallet = require('./Router/WalletRouter')
const payment = require('./Router/PaymentRouter')
const betting_history = require('./Router/Betting_historyRouter')
const ethereum = require('./Router/EthereumRouter')
const withdraw = require('./Router/WithdrawRouter')
const withdrawfiat = require('./Router/WithdrawFiatRouter')
const interntransfer = require('./Router/InternTrasnferRouter')
const AccountBank = require('./Router/AccountBankRouter')
const documents = require('./Router/DocumentsRouter')

const PriceController = require('./Controller/PriceController')
const Ethereum = require('./Repositories/Ethereum')
const ethereumRepo = new Ethereum()

require('./DataBase/index')
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/user',user)
app.use('/',login)
app.use('/price', price)
app.use('/jogos', jogos)
app.use('/order',order)
app.use('/wallet',wallet)
app.use('/payment',payment)
app.use('/betting_history',betting_history)
app.use('/ethereum',ethereum)
app.use('/withdraw',withdraw)
app.use('/withdrawfiat',withdrawfiat)
app.use('/interntransfer',interntransfer)
app.use('/banks',AccountBank)
app.use('/documents',documents)
app.use(
  "/files",
   express.static(path.resolve(__dirname,"..", "documents","upload"))
);
app.use(
  "/image",
   express.static(path.resolve(__dirname,"..", "Image","profile"))
);

app.use(express.static(path.join(__dirname, '/build')));
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/build' + '/index.html')
});

setInterval(async () => {
  await PriceController.refreshPrices()
  //console.log("1 segundo")
}, 3000)

setInterval(async () => {
  await PriceController.refreshGasPrices()

}, 10000)

setInterval(() => {
  ethereumRepo.postback()
}, 900000)

setInterval(() => {
  PriceController.AtualizandoBotoes()
} ,5000)



setInterval(() => {
  ethereumRepo.postback()
}, 7000)

const port = process.env.PORT || 4100;

app.listen(port, function () {
  console.log("Servidor iniciado na porta:", port);
})
