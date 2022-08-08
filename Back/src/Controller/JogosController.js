const express = require('express')
const coinMarket = require('../Repositories/CoinMarket')
const gasPrices = require('../Repositories/GasPrice')
const Price = require('../Model/PriceModel')
const Jogos = require('../Model/JogosModel')
const umbrellaPrice = require('../Model/UmbrellaPriceModel')
const IdSuexController = require('./IdSuexController')
const GasPrice = require('../Model/GasPriceModel')
const UmbrelaPrice = require('../Model/UmbrellaPriceModel')
const allCoins = require('../Config/globalConfig.json').allCoins
const globalConfig = require('../Config/globalConfig.json')
const PriceMarket = require('../Model/PriceMarketModel')
const { Op } = require('sequelize')
const { date } = require('yup/lib/locale')

let ImprimeData = new Date();
var aux = 0
var aux1 = 0
var aux2 = 0



function getFormattedDate() {
    var date = new Date()
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    var formatterDay;
    if (day < 10) {
        formatterDay = '0' + day;
    } else {
        formatterDay = day;
    }

    var formatterMonth;
    if (month < 10) {
        formatterMonth = '0' + month;
    } else {
        formatterMonth = month;
    }

    return formatterDay + '/' + formatterMonth + '/' + year;
}
function formatvalue(value, type) {

    if (type == "BTC") {
        // console.log(type)
        // console.log(value)
        var str = value.toString();
        var arr = str.split('.');
        let auxvalue = ''
        if (array = arr[1]) {
            let array = arr[1].split('')

            for (let index = 0; index < 3; index++) {
                let element = array[index];
                if (!element) {
                    element = "0"
                }
                auxvalue = auxvalue + element

            }
        } else {
            auxvalue = '000'
        }
        let resp = arr[0] + auxvalue
        return parseFloat(resp)
    }

    return value
}

class JogosController {
    
    
    static async AtualizandoBotoes() {
        console.log("Impriminado data" + ImprimeData)        
    
        }

    static async refreshPrices() {
        try {
            const prices = await coinMarket.getValue()
            if (prices != undefined) {
                //const idsuexPrice = IdSuexController.setValue(prices.data[3575].quote.BRL.price / 31.1035, prices.data[2790].quote.BRL.price, prices.data[825].quote.BRL.price)
               let valormil = 1000
                const upPrices = await allCoins.map(async function (coin) {
                    if (coin.idbd != "") {
                        if (coin.flag) {
                            let market = prices[coin.uid]
                            if(market){
                                if(coin.symbol=="USDT"||coin.symbol=="USD"){
                                    await Price.update(
                                        {
                                            price: formatvalue(market.ask, coin.symbol),
                                            daily_percent_change: market.pctChange
                                        }, {
                                        where: {
                                            id: coin.idbd
        
                                        }
                                    })
        
                                    if(aux == 0){
                                        await PriceMarket.create(
                                            {
                                                uid: coin.idbd,
                                                coin: coin.id,
                                                code: market.code,
                                                high: market.high ,
                                                low: market.low ,
                                                varBid: market.varBid  ,
                                                pctChange: market.pctChange,
                                                bid:market.bid  ,
                                                ask:String(Number(market.ask) + 2),
            
                                            })
                                            aux = aux + 1
                                            console.log(aux)

                                    }else{
                                        await PriceMarket.create(
                                            {
                                                uid: coin.idbd,
                                                coin: coin.id,
                                                code: market.code,
                                                high: market.high ,
                                                low: market.low ,
                                                varBid: market.varBid  ,
                                                pctChange: market.pctChange,
                                                bid:market.bid  ,
                                                ask:market.ask  ,
            
                                            })    
                                            aux = 0
                                            console.log(aux)
                                    }

                                }else{
                                    let priceUSD = prices['USDBRL'].high
                                await Price.update(
                                    {
                                        price: market.ask*priceUSD,
                                        daily_percent_change: market.pctChange
                                    }, {
                                    where: {
                                        id: coin.idbd
    
                                    }
                                })
    
                                if(coin.symbol=="LTC"||coin.symbol=="USD"){

                                    if(aux1 == 0){
                                        await PriceMarket.create(
                                            {
                                                uid: coin.idbd,
                                                coin: coin.id,
                                                code: market.code,
                                                high: market.high ,
                                                low: market.low ,
                                                varBid: market.varBid  ,
                                                pctChange: market.pctChange,
                                                bid:market.bid  ,
                                                ask:String(Number(market.ask) + 2),
            
                                            })
                                            aux1 = aux1 + 1
                                            console.log(aux)

                                    }else{
                                        await PriceMarket.create(
                                            {
                                                uid: coin.idbd,
                                                coin: coin.id,
                                                code: market.code,
                                                high: market.high ,
                                                low: market.low ,
                                                varBid: market.varBid  ,
                                                pctChange: market.pctChange,
                                                bid:market.bid  ,
                                                ask:market.ask  ,
            
                                            })    
                                            aux1 = 0
                                            console.log(aux)
                                    }
                                }else{

                                    if(aux2 == 0){
                                        await PriceMarket.create(
                                            {
                                                uid: coin.idbd,
                                                coin: coin.id,
                                                code: market.code,
                                                high: market.high ,
                                                low: market.low ,
                                                varBid: market.varBid  ,
                                                pctChange: market.pctChange,
                                                bid:market.bid  ,
                                                ask:String(Number(market.ask) + 2),
            
                                            })
                                            aux2 = aux2 + 1
                                            console.log(aux)

                                    }else{
                                        await PriceMarket.create(
                                            {
                                                uid: coin.idbd,
                                                coin: coin.id,
                                                code: market.code,
                                                high: market.high ,
                                                low: market.low ,
                                                varBid: market.varBid  ,
                                                pctChange: market.pctChange,
                                                bid:market.bid  ,
                                                ask:market.ask  ,
            
                                            })    
                                            aux2 = 0
                                            console.log(aux)
                                    }
    
                                        
                                    
                                    }
                                }

                                

                            }
                            // let aux = await PriceMarket.max('id', { where:{'code':market.code} })
                            // let mktcoin = await PriceMarket.findOne({ where:{'id':aux} })
                            //    if(market){
                            //     console.log("ok")
                            //     console.log("ok",market.ask)
                            //    }else{
                            //     console.log("erro",market)
                            //    }
                            //console.log("coinmarket:", market)
                      
                            //console.log("up price ID: ", coin.idbd)

                        } else {
                            let market = prices['USDBRL']
                            let data = getFormattedDate()
                            let Uprice = await UmbrelaPrice.findOne({ where: { uid: coin.idbd, data: data } });
                            if (Uprice != null) {
                                 console.log("atualizando....")
                                Uprice.price = market.ask * 1.6
                                Uprice.daily_percent_change = market.pctChange
                                Uprice.uuid = coin.id
                                Uprice.code = market.code
                                await Uprice.save()
                                 console.log("price", Uprice.price, "code", Uprice.code)
                            } else {
                                 console.log("criando....")
                                await UmbrelaPrice.create({ uid: coin.idbd, uuid: coin.id, price: market.ask * 1.6, data: data })
                               / console.log("criado!")
                            }
                            await PriceMarket.create(
                                {
                                    uid: coin.idbd,
                                    coin: coin.id,
                                    code: coin.symbol,
                                    high: market.high * 1.6,
                                    low: market.low * 1.6,
                                    varBid: market.varBid * 1.6,
                                    pctChange: market.pctChange,
                                    bid: market.bid * 1.6,
                                    ask: market.ask * 1.6

                                })
                        }
                          console.log("valores atualizados")
                            console.log("up price ID: ", coin.symbol)
                            console.log("valor", coin.valor)
                            
                            console.log(ImprimeData)
                    }

                }

                )
            } else {

                // console.log("erro em atualizar preço")
            }
            // const idsuexPrice = IdSuexController.setValue(prices.data[3575].quote.BRL.price / 31.1035, prices.data[2790].quote.BRL.price, prices.data[825].quote.BRL.price)
            // const btcprice = await Price.update(
            //     {
            //         price: prices.data[1].quote.BRL.price,
            //         market_cap: prices.data[1].quote.BRL.market_cap,
            //         percent_change: prices.data[1].quote.BRL.percent_change_1h,
            //         daily_volume: prices.data[1].quote.BRL.volume_24h,
            //         daily_percent_change: prices.data[1].quote.BRL.percent_change_24h
            //     }, {
            //     where: {
            //         id: 11
            //     }
            // })
            // const usdprice = await Price.update(
            //     {
            //         price: prices.data[825].quote.BRL.price,
            //         market_cap: prices.data[825].quote.BRL.market_cap,
            //         percent_change: prices.data[825].quote.BRL.percent_change_1h,
            //         daily_volume: prices.data[825].quote.BRL.volume_24h,
            //         daily_percent_change: prices.data[825].quote.BRL.percent_change_24h
            //     }, {
            //     where: {
            //         id: 12
            //     }
            // })
            // const ltcprice = await Price.update(
            //     {
            //         price: prices.data[2].quote.BRL.price,
            //         market_cap: prices.data[2].quote.BRL.market_cap,
            //         percent_change: prices.data[2].quote.BRL.percent_change_1h,
            //         daily_volume: prices.data[2].quote.BRL.volume_24h,
            //         daily_percent_change: prices.data[2].quote.BRL.percent_change_24h
            //     }, {
            //     where: {
            //         id: 13
            //     }
            // })
            // const etherprice = await Price.update(
            //     {
            //         price: prices.data[1027].quote.BRL.price,
            //         market_cap: prices.data[1027].quote.BRL.market_cap,
            //         percent_change: prices.data[1027].quote.BRL.percent_change_1h,
            //         daily_volume: prices.data[1027].quote.BRL.volume_24h,
            //         daily_percent_change: prices.data[1027].quote.BRL.percent_change_24h
            //     }, {
            //     where: {
            //         id: 14
            //     }
            // })
            // const idsuexprice = await Price.update(
            //     {
            //         price: prices.data[825].quote.BRL.price * 1.6,
            //         market_cap: prices.data[825].quote.BRL.market_cap,
            //         percent_change: prices.data[825].quote.BRL.percent_change_1h,
            //         daily_volume: prices.data[825].quote.BRL.volume_24h,
            //         daily_percent_change: prices.data[825].quote.BRL.percent_change_24h
            //     }, {
            //     where: {
            //         id: 15
            //     }
            // })
        } catch (err) {
            console.log(err.message)
        }
    }
    static async refreshGasPrices() {
        try {
            const gasprice = await gasPrices.getGasPrice()
            if (gasprice.isAxiosError == undefined) {
                const slow = await GasPrice.update(
                    {
                        type: 'SafeGasPrice',
                        price: gasprice.result.SafeGasPrice,
                    }, {
                    where: {
                        id: 1
                    }
                })
                const normal = await GasPrice.update(
                    {
                        type: 'ProposeGasPrice',
                        price: gasprice.result.ProposeGasPrice,
                    }, {
                    where: {
                        id: 2
                    }
                })
                const fast = await GasPrice.update(
                    {
                        type: 'FastGasPrice',
                        price: gasprice.result.FastGasPrice,
                    }, {
                    where: {
                        id: 3
                    }
                })
            }
        } catch (err) {
            console.log({ err })
        }
    }
    static async getGasPrice(req, res) {

        const { gasType, type } = req.body
        try {
            const gasPrices = await GasPrice.findOne({ where: { type: gasType } })
            let gastEth = (gasPrices.price * globalConfig.gasLimit) / 1000000000

            let ethePrice = await Price.findOne({ where: { coin: "1027" } })
            // console.log("ethe/real",ethePrice.price)
            let realPrice = (parseFloat(gastEth) * ethePrice.price) + globalConfig.tax
            let aux = await Price.findOne({ where: { coin: type } })
            let valueTotal = realPrice / aux.price
            //  console.log("total ", valueTotal)
            const response = {
                gas: gasPrices.price,
                gasPricetype: valueTotal,
                gasType: gasPrices.type

            }
            return res.status(200).json(response)
        } catch (err) {
            return res.status(200).json({ "Erro": `Não foi possível pegar os preços do Gás: ${err}` })
        }
    }



    static async getJogos(req, res) {
        try {
         const jogos = await PriceMarket.findAll()
        // const jogos = {
        //     id:1
        // }
            return res.status(200).json(jogos)
        } catch (err) {
            return res.status(200).json({ "Erro": `Não foi possível pegar os preços: ${err}` })
        }
    }


    static async getPrices2(req, res) {
        try {
            let response = []
            const removeNullProperties = async (obj) => {
                Object.keys(obj).forEach(key => {
                    let value = obj[key];
                    let hasProperties = value && Object.keys(value).length > 0;
                    if (value === null) {
                        delete obj[key];
                    }
                    else if ((typeof value !== "string") && hasProperties) {
                        removeNullProperties(value);
                    }
                });
                return obj;
            }
            const getData = async () => {
                return Promise.all(allCoins.map(async function (coin) {
                    if (coin.idbd) {
                        let aux = await PriceMarket.max('id', { where: { 'uid': coin.idbd } })
                        let mktcoin = await PriceMarket.findOne({ where: { 'id': aux } })
                        // var objt = {}
                        // var key = coin.idbd 

                        // objt[key] = mktcoin.dataValues
                        //  let newResp = await Object.assign(response,  mktcoin.dataValues);

                        // console.log(ne)
                        return mktcoin.dataValues
                    } else {
                        return
                    }
                }))
            }
            var results = await getData()
            // var resp =await getData(removeNullProperties)
            return res.status(200).json(results)
        } catch (err) {
            return res.status(200).json({ "Erro": `Não foi possível pegar os preços: ${err}` })
        }
    }
    static async getAllPrices(req, res) {
        try {
            let response = []
            const removeNullProperties = async (obj) => {
                Object.keys(obj).forEach(key => {
                    let value = obj[key];
                    let hasProperties = value && Object.keys(value).length > 0;
                    if (value === null) {
                        delete obj[key];
                    }
                    else if ((typeof value !== "string") && hasProperties) {
                        removeNullProperties(value);
                    }
                });
                return obj;
            }
            const getData = async () => {
                let newResp  =[]
                return Promise.all(allCoins.map(async function (coin) {
                    if (coin.idbd) {
                        let aux = await PriceMarket.max('id', { where: { 'uid': coin.idbd } })
                        let mktcoin = await PriceMarket.findOne({ where: { 'id': aux } })
                         var objt = {}
                         var key = mktcoin.code 

                         objt[key] = mktcoin.dataValues
                        
                         newResp.push(objt);

                        // console.log(ne)
                        return objt
                    } else {
                        return
                    }
                }))
            }
            let newResp={}
            var results = await getData()
            for (let index = 0; index < results.length; index++) {
                const element = results[index];
                newResp = await Object.assign(newResp, element);
                
            }
            // var resp =await getData(removeNullProperties)
            return res.status(200).json(newResp)
        } catch (err) {
            return res.status(200).json({ "Erro": `Não foi possível pegar os preços: ${err}` })
        }
    }
    static async getuPrices(req, res) {
        try {
            const { type } = req.params
            //const prices = await umbrellaPrice.findAll({ attributes: ['price', 'data'], where: { uuid: type } })
            const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 15));
            const prices = await umbrellaPrice.findAll({
                attributes: ['price', 'data'],
                where: {
                    createdAt: {
                    [Op.gte]: sevenDaysAgo
                  }
                }
              })

            return res.status(200).json(prices)
        } catch (err) {
            console.log(err)
            return res.status(200).json({ "Erro": `Não foi possível pegar os preços: ${err}` })
        }
    }
}
module.exports = JogosController