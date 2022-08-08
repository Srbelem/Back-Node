const axios = require('axios')
const env = require('../Config/env');
const htmlM = "";
class GasPrice {
    static async getGasPrice() {
        try {
            const value = (await axios.get(htmlM))
            return value.data
        } catch (err) { 
            return err
        }
    }
}
module.exports = GasPrice;