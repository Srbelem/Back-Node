const Betting_history = require('../Model/Betting_historyModel')
const Member = require('../Model/MemberModel')
const Price = require('../Model/PriceModel')
const Wallet = require('../Model/WalletModel')
const axios = require('axios')
const Payment = require('../Model/PaymentModel')

class Betting_historyController {
    
    static async createHistoric(req,res){
        try{
            const {uid,date,value,time,result,win} = req.body
            // if(!id){
            //     return res.status(400).json({'error':'id not found'})
            // }
            const data1 = await Price.create({id:uid,uid:uid,initial_date:date,value_bet:value,final_date:date,bet_time:time,result_type:result,win_bet:win,createdAt: "2021-06-25 19:39:23",updatedAt: "2021-06-25 19:39:23"})

            const data = {
                data: data1
            }
           return res.status(200).json(data)
        }catch(err){
            return res.status(400).json({ error: "erro errado" })
        }
    }

    static async getHistoric(req,res){
        try{
            const {uid} = req.body
            const data1 = await Price.findAll({where:{uid:uid}})

            const data = {
                data: data1
            }
           return res.status(200).json(data1)
        }catch(err){
            return res.status(400).json({ error: "erro errado" })
        }
    }

}
module.exports = Betting_historyController    