const axios = require('axios')
const env = require('../Config/env')
class LatamGateway {
    static async generateToken() {
        try {
            const tokenGenerate = await axios.post(`${env.LATAM_GATEWAY}/auth`,
                {
                    "email": env.EMAIL,
                    "password":env.PASSWORD_LATAM
                }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            return tokenGenerate.data.token;
        } catch (err) {
            return err;
        }
    }
    static async createPayment(user) {
        try {
            const token = await this.generateToken()
             //     console.log(user)
            // const payment = await axios.post(`${env.LATAM_GATEWAY}/order`, user, {
            // const payment = await axios.post(`${env.LATAM_GATEWAY}/gerar-pix-externo`, user, {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'ACCOUNT_TOKEN': token,
            //     }
            // })

            const payment = await axios.post("")
            if(!user.order.bank_slug) {
                const qrCode = await axios.get(payment.data.qrcode_link, {
                    headers: {
                        'Content-Type': 'application/json',
                        'ACCOUNT_TOKEN': token,
                    }
                })
                payment.data.qrData = qrCode.data
            }

            // if(!user.order.bank_slug) {
            //     const qrCode = await axios.get(payment.data.QrCodeTxt, {
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'ACCOUNT_TOKEN': token,
            //         }
            //     })
            //     payment.data.qrData = qrCode.data
            // }
            payment.data.method = user.order.payment_method
            return payment.data
        } catch (err) {
            console.log('errrrr', err)
            return { error: err }
        }

    }
    static async creditCard(user) {
        try {
            const token = await this.generateToken()
            const payment = await axios.post(`${env.LATAM_GATEWAY}/checkout/form`, user, {
                headers: {
                    'Content-Type': 'application/json',
                    'ACCOUNT_TOKEN': token,
                }
            })
            payment.data.method = user.order.payment_method
            return payment.data
        } catch (err) {
            return err;
        }
    }
}

module.exports = LatamGateway