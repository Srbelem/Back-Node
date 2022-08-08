const Member = require('../Model/MemberModel')
const AccountBank = require('../Model/AccountBankModel')
const Bank = require('../Model/BanksModel')
const Pix = require('../Model/PixModel')
const yup = require('yup')
class AccountBanks {
    static async registryBank(req, res) {
        try {
            const { uid,
                bank,
                accountType,
                account,
                digit,
                agency,
                holderName
            } = req.body
            const schema = yup.object().shape({
                uid: yup.number().required('UID required'),
                accountType: yup.string().required('Account Type required'),
                account: yup.string().required('Account required'),
                digit: yup.string().required('Digit required'),
                agency: yup.string().required('Agency required'),
            })
            schema.validate(req.body)
            const user = Member.findByPk(uid)
            if (!user) {
                return res.status(400).json({ "error": 'user not found' })
            }
            const register = AccountBank.create({
                uid,
                bank,
                accountType,
                account,
                digit,
                agency,
                holderName
            })
            return res.status(200).json({ 'sucess': true })

        } catch (err) {
            return res.status(400).json(err)
        }
    }
    static async banksUser(req, res) {
        try {
            const { id } = req.params
            const user = Member.findByPk(id)
            if (!user) {
                return res.status(400).json({ "error": 'user not found' })
            }
            const banks = await AccountBank.findAll({ where: { uid: id } })
            return res.status(200).json(banks)

        } catch (err) {
            return res.status(400).json(err)

        }

    }
    static registerPix(req,res){
        const{uid,typePix,name,pix} = req.body
        const schema = yup.object().shape({
            uid: yup.number().required('UID required'),
            typePix: yup.string().required('Type Pix required'),
            name: yup.string().required('Name Pix required'),
            pix: yup.string().required('Pix required'),
        })
        schema.validate(req.body)
        const user = Member.findByPk(uid)
        if (!user) {
            return res.status(400).json({ "error": 'user not found' })
        }
        const register = Pix.create({
            uid,typePix,pix,name
        })
        return res.status(200).json({ 'sucess': true })

    }
    static async pixUser(req,res){
        try {
            const { id } = req.params
            const user = Member.findByPk(id)
            if (!user) {
                return res.status(400).json({ "error": 'user not found' })
            }
            const pixs = await Pix.findAll({ where: { uid: id } })

            return res.status(200).json(pixs)

        } catch (err) {
            return res.status(400).json(err)

        }
    }
    
    static async banks(req, res) {
        try {
            const banksAll = await Bank.findAll({
                order: [
                    ['titulo', 'ASC']]
            })
            return res.status(200).json(banksAll)
        } catch (err) {
            return res.status(400).json(err)
        }
    }


}

module.exports = AccountBanks;