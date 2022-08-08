const axios = require('axios')
const env = require('../Config/env');
const configCoins = require('../Config/globalConfig.json').allCoins
class CoinMarket {
    static async getValue() {
        let coins = ""
        configCoins.map(function (coin) {
            if (coins == "") {
                coins = coin.apicoin 
            } else {
                if (coin.flag) {
                    coins = coins + "," + coin.apicoin
                }
            }
        })

        try {

    
            let newhtml = "https://economia.awesomeapi.com.br/last/" + coins
            //let newhtml = "https://brasilbitcoin.com.br/API/prices/" + coins



            const value = (await axios.get(newhtml.replace("USD", ""), {}))
            console.log(newhtml)
            console.log(value.data)
            return value.data
            // const value = (await axios.get(``, {
            //     headers: {
            //         'X-CMC_PRO_API_KEY': env.coinMarket,
            //         "Access-Control-Allow-Origin": "*"
            //     }
            // }))
            //consultar moedas 
            //const value2 = (await axios.get(``, {
            //     headers: {
            //         'X-CMC_PRO_API_KEY': env.coinMarket,
            //         "Access-Control-Allow-Origin": "*"
            //     }
            // }))
            // console.log(value2.data)
            //return value.data
        } catch (err) {
            console.log(err)
            return err
        }
    }
}
module.exports = CoinMarket;