const request = require('request')
const yup = require('yup')
const Order = require('../Model/OrderModel')
const Member = require('../Model/MemberModel')
const Wallet = require('../Model/WalletModel')
const LatamGateway = require('../Repositories/LatamGateway')
const axios = require('axios')
const env = require('../Config/env')
const Payment = require('../Model/PaymentModel')
const statusPayment = require('../Repositories/StatusPayment')
const generateIdPedido = require('../Repositories/GenerateIdPedido')
const ValidUser = require('../Repositories/validerUser')
const StatusVip = require('../Model/StatusVipModel')

class PaymentController {


    static async pix(req, res) {
        const info = req.body
        try {            
           const payment = request.post(
            {
              url: '',
              form: {
                PayerType: '1',
                PayerCPF: '',
                PayerName:'',
                PayerEmail: '',
                PayerCelular: '',
                PayerCEP: "",
                PayerEndereco: "Endereco do Pagador",
                PayerNumero: "Numero",
                PayerBairro: "Bairro",
                PayerCidade: "Cidade",
                PayerEstado: "Estado",
                Valor: "0.01",
                Referencia: "Pedido referente ao pedido N 2522201",
                Tempo: "3600",
                idpedidoext: "12511"
              }
            },
            (err, response, body) => {
            }
          );

        
        
           const response = {
                    // "wallet": {
                    //     // "balance": payment.data.status
                    //     "balance": payment.data
                    // }
                    "dados" : payment.data,
                    "info" : info.value

                }
                return res.status(200).json(response)
        } catch (err) {
            return res.status(400).json({ err: "Wallet error" })

        }
    }




    static async create(req, res) {
        try {
            const payment = (await axios.post(''))
            const { id, value, type } = req.body
            const idpedido = await generateIdPedido()
            const { bankSlug } = req.query
            const data = await Member.findByPk(id)
            const user = {
                "customer": {
                    "name": data.firstName + " " + data.secondName,
                    "document": data.IdDocument.replace('.', '').replace('-', ''),
                    "email": data.email,
                    "phone": data.mobile,
                    "birth": "01/01/2001"
                },
                "order": {
                    "code": idpedido,
                    "notification_url": "",
                    "value": value,
                    "additional_info": `${type} criado por ${data.firstName + " " + data.secondName} no valor de R$ ${value}`,
                    "payment_method": type
                }
            }
            if (type == 'deposit') {
                user.order.bank_slug = bankSlug
            }
            const latam = await LatamGateway.createPayment(user, res);
            if(latam.error) {
                console.error(latam)
                return res.status(400).json({ error: latam.error.message })
            } else {
                console.log(latam)
                if(latam.method == 'deposit') {
                    const payment = await Payment.create({uid:id,type:type,status:0,value:value,latam_id:latam.latam_id,code:latam.code, confirmationurl: latam.confirmation_url,idStatus:0})
                } else {
                    const payment = await Payment.create({uid:id,type:type,status:0,value:value,latam_id:latam.latam_id,code:latam.code, confirmationurl: latam.confirmation_url, qrcodeimage: latam.qrData.qrcode_image ? latam.qrData.qrcode_image : latam.qrData.qrcode_app_link, barcode: latam.qrData.barcode, pdf:  latam.qrData.pdf,idStatus:0})
                }
            }

             return res.status(200).json(payment)
              //return res.status(200).json({valor:"texto"})
         } catch (err) {
             return res.status(400).json({ error: err.message })
         }
    // } 
    }
    
    static async creditCardRedirect(req, res) {
        try {
            const { id, value, type } = req.body
            const idpedido = await generateIdPedido()
            const data = await Member.findByPk(id)
            const user = {
                "order": {
                    "code": idpedido,
                    "notification_url": "",
                    "redirect_url": "",
                    "value": value,
                    "additional_info": `Credit Card criado por ${data.firstName + " " + data.secondName} no valor de R$ ${value}`,
                    "payment_method": "credit_card"
                }
            }
            const latam = await LatamGateway.creditCard(user);
            if(latam.error) {
                return res.status(400).json({ error: err.message })
            } else {
                const payment = await Payment.create({uid:id,type:type,status:0,value:value,latam_id:latam.latam_id,code:latam.code})
            }
            console.log(latam)
            return res.status(200).json(latam)
        } catch (err) {
            return res.status(400).json({ errir: err.message })
        }
    }
    
    static async banks(req,res){
        try {
            const tokenGenerate = await LatamGateway.generateToken()
            const payment = await axios.get(`${env.LATAM_GATEWAY}/banks`, {
              headers: {
                'Content-Type': 'application/json',
                'ACCOUNT_TOKEN': tokenGenerate,
      
              }
            })
            return res.status(200).json(payment)
          }
          catch (err) {
            return res.status(400).json({ error: err.message })
      
          }
    }

    // static async payments(req,res){
    //     try{
    //         const {id} = req.body
    //         if(!id){
    //             return res.status(400).json({'error':'id not found'})
    //         }
    //         const data = await Payment.findAll({where:{uid:id}})
    //         return res.status(200).json(data)
    //     }catch(err){
    //         return res.status(400).json({ error: err.message })
    //     }
    // }

    static async payments(req,res){
        try{
            const {id} = req.body
            if(!id){
                return res.status(400).json({'error':'id not found'})
            }
            const data = await Payment.findAll({where:{uid:id}})
            return res.status(200).json(data)
        }catch(err){
            return res.status(400).json({ error: err.message })
        }
    }

    static async postback(req,res){
        try {
            const { latam_id, code, status } = req.body
            const statusNumber = statusPayment(status)
            await Payment.update({status:statusNumber},{where:{latam_id,code}})
            const payment = await Payment.findOne({where:{latam_id,code}})
            if(statusNumber==101){
                const walletInput = await Wallet.findOne({ where: { uid:payment.uid, type: 0 } })
                const walletAtt = await Wallet.update({ balance: walletInput.balance + payment.value }, { where: { uid:payment.uid, type: 0 } })
            }
            return res.status(200).json({sucess:'updated status'})
        } catch (err) {
            return res.status(400).json({ error: { mensagen: 'Unexpected error', flag: "" }})
        }
    }
    static async maxValue(req,res){
        try {
            const { authKey } = req.body;
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let id = checkUser.sucess.id
                const status = await Member.findOne({attributes: [ 'statusVip'], where: { id:id } })
                const maxValue = await StatusVip.findOne({attributes: [ 'limit'], where: { status:status.dataValues.statusVip } })
             
                return res.status(200).json({maxValue:maxValue.dataValues.limit})

            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }
            
            }
        } catch (err) {
            return res.status(400).json({ error: { mensagen: 'Unexpected error', flag: "" }})
        }
    }
    
}
module.exports = PaymentController