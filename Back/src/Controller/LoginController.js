const yup = require('yup')
const Member = require('../Model/MemberModel')
const EmailSender = require('./EmailSenderController')
const bscrypt = require('bcryptjs')
const crypto = require('crypto')
const { use } = require('../Router/UserRouter')
const numberRegExp = /^[0-9]*$/
var CryptoJS = require("crypto-js");
const key = require('../Config/config.json').keyCripto.key
const speakeasy = require('speakeasy')
const ValidUser = require('../Repositories/validerUser')

class Login {
    static async login(req, res) {
        try {
            const { login, password } = req.body
            const schema = yup.object().shape({
                password: yup.string().required('Senha Obrigatória')
            })
            let user;
            await schema.validate(req.body)
            if (login) {
                user = await Member.findOne({ where: { login } })
                if (!user) {
                    user = await Member.findOne({ where: { email: login } })
                }
            } else {
                return res.status(200).json({ "Error": 'Enter login' })
            }
            if (!user) {
                return res.status(200).json({ "Error": 'User not found' })
            }
            let passwordNow = CryptoJS.MD5(password).toString();
            if (passwordNow!=user.password) {
                return res.status(200).json({ "Error": 'Senha Inválida' })
            }

            //security
            let hash = await bscrypt.hash("hashSecuryti", 10);
            user.Hash = hash
            await user.save();
            let authKey = {
                userHash: hash,
                id: user.id,
                IsAuth: user.IsAuth,
                IdDocument: user.IdDocument,

            }
            var cipherAuth = CryptoJS.AES.encrypt(JSON.stringify(authKey), key).toString();
            //remover id:user.id
            let responseUser = {
                id:user.id,
                authKey: cipherAuth,
                IsAuth: user.IsAuth,
                avatar: user.avatar,
                email: user.email,
                emailValidate: user.emailValidate,
                firstName: user.firstName,
                login: user.login,
                mobile: user.mobile,
                nacionalidade: user.nacionalidade,
                secondName: user.secondName,
                telephone: user.telephone,
                statusVip: user.statusVip,
                mobileCode:user.mobileCode
            };

            return res.status(200).json(responseUser)
        } catch (err) {
            return res.status(400).json({ "Error": "Tivemos um problema no servidor, aguarde" })
        }
    }
    static async validTwoFactor(req, res) {
        const { hashUser, code } = req.body
        var bytes = await CryptoJS.AES.decrypt(hashUser, key);
        var userkeys = await JSON.parse(bytes.toString(CryptoJS.enc.Utf8));


        try {
            const user = await Member.findByPk(userkeys.id)
            const token = await speakeasy.totp.verify({
                secret: user.AuthToken,
                encoding: 'ascii',
                token: code

            }
            )
            return res.status(200).json(token)


        } catch (err) {
            return res.status(400).json({ err: 'erro valid two factor. code: 004' });
        }
    }
    static async forgot(req, res) {
        try {
            const { email } = req.body;
            const schema = yup.object().shape({
                email: yup.string().email('Digite um e-mail válido').required('Campo Obrigatório')
            })
            await schema.validate(req.body)

            const user = await Member.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ error: 'User not found' });

            }

            const token = crypto.randomBytes(10).toString('hex');
            const now = new Date();
            now.setMinutes(now.getMinutes() + 30);
            await Member.update({
                passwordResetToken: token,
                passwordResetExpires: now
            }, { where: { email } });

            const response = await EmailSender.sendforgotUser(email, user.firstName + " " + user.secondName, token);
            return res.status(response.status).json({ message: response.message })
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    static async resetConfirmData(req, res) {
        try {
            const { IdDocument, token } = req.body;
            const schema = yup.object().shape({
                IdDocument: yup.string()
                    .matches(numberRegExp, 'O IDDocument deve conter apenas números')
                    .required('CPF Obrigatório'),
            })
            await schema.validate({
                IdDocument
            })

            const user = await Member.findOne({ where: { IdDocument } })

            if (!user)
                return res.status(400).json({ error: { mensagen: 'User not found', flag: "user" } });
            if (token !== user.passwordResetToken)
                return res.status(400).json({ error: { mensagen: 'Token inválido', flag: 'token' } });
            const now = new Date();
            if (now > user.passwordResetExpires)
                return res.status(400).json({ error: { mensagen: 'Tempo expirou, tente novamente!', flag: 'token' } });

            return res.status(200).json({ sucess: true })

        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    static async reset(req, res) {
        try {
            const { IdDocument, password, confirmPassword } = req.body;


            const schema = yup.object().shape({
                IdDocument: yup.string()
                    .matches(numberRegExp, 'O IDDocument deve conter apenas números')
                    .required('IdDocument Obrigatório'),
            })
            await schema.validate(req.body)

            const user = await Member.findOne({ where: { IdDocument } })

            if (!user)
                return res.status(406).json({ error: 'User not found' });

            if (password !== confirmPassword)
                return res.status(406).json({ error: 'As senhas não coincidem' });
            user.password = await CryptoJS.MD5(password).toString();
            await user.save();
            return res.status(200).json({ sucess: true })

        } catch (err) {
            res.status(400).json(err);
        }

    }
    static async logout(req, re) {
    }
    static async usernameVerification(req, res) {
        try {
            const { login } = req.params
            const user = await Member.findOne({ where: { login } })
            console.log(user)
            if (!user) {
                res.status(200).json({ login: false })
            } else {
                res.status(200).json({ login: true })
            }
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    static async validateEmail(req, res) {
        try {
            const { email } = req.body
            console.log(req.body)
            const schema = yup.object().shape({
                email: yup.string().email().required('Campo Obrigatório')
            })
            await schema.validate(req.body)
            const user = await Member.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }
            const token = crypto.randomBytes(10).toString('hex');
            const now = new Date();
            now.setMinutes(now.getMinutes() + 30);
            await Member.update({
                emailTokeValidate: token,
                emailValidateExpires: now
            }, { where: { email } });
            const response = await EmailSender.sendValidateEmail(email, user.firstName + " " + user.secondName, token);
            return res.status(response.status).json({ message: response.message })


        } catch (err) {

            return res.status(400).json(err)
        }

    }
    static async confirmRemove2FA(req, res) {
        try {
            const {authKey, token } = req.body;
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let id = checkUser.sucess.id
                const user = await Member.findByPk(id)

                if (!user)
                    return res.status(400).json({ error: 'User not found' });

                if (token !== user.emailTokeValidate)
                    return res.status(400).json({ error: 'Token inválido' });
                const now = new Date();
                if (now > user.emailValidateExpires)
                    return res.status(400).json({ error: 'Tempo expirou, tente novamente!' });
                user.IsAuth = 0
                await user.save();
                return res.status(200).json({ sucess: true });
            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }

        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    static async confirmEmail(req, res) {
        try {
            const { authKey, token } = req.body;
            var bytes = await CryptoJS.AES.decrypt(authKey, key);
            var userHash = await JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            let IdDocument = userHash.IdDocument
            const schema = yup.object().shape({
                IdDocument: yup.string()
                    .required('IdDocument Obrigatório'),
            })
            await schema.validate({
                IdDocument
            })
            const user = await Member.findOne({ where: { IdDocument } })

            if (!user)
                return res.status(400).json({ error: 'User not found' });
            console.log(token)
            console.log(user.emailTokeValidate)
            if (token !== user.emailTokeValidate)
                return res.status(400).json({ error: 'Token inválido' });
            const now = new Date();
            if (now > user.emailValidateExpires)
                return res.status(400).json({ error: 'Tempo expirou, tente novamente!' });
            user.emailValidate = true
            let hash = await bscrypt.hash("hashSecuryti", 10);
            user.Hash = hash
            await user.save();
            let keys = {
                userHash: hash,
                id: user.id,
                IsAuth: user.IsAuth,
                IdDocument: user.IdDocument,

            }
            var cipherAuth = CryptoJS.AES.encrypt(JSON.stringify(keys), key).toString();
            let responseUser = {
                authKey: cipherAuth,
                IsAuth: user.IsAuth,
                avatar: user.avatar,
                email: user.email,
                emailValidate: user.emailValidate,
                firstName: user.firstName,
                login: user.login,
                mobile: user.mobile,
                nacionalidade: user.nacionalidade,
                secondName: user.secondName,
                telephone: user.telephone,
                statusVip: user.statusVip,
                mobileCode:user.mobileCode
                
            };
            return res.status(200).json({ sucess: true, responseUser });
        } catch (err) {
            res.status(400).json({ error: "erro ao confirmar email" });
        }
    }


}

module.exports = Login