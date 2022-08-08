const yup = require('yup')
const bcrypt = require('bcryptjs')
const Member = require('../Model/MemberModel')
const Wallet = require('../Model/WalletModel')
const numberRegExp = /^[0-9]*$/
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')
const bscrypt = require('bcryptjs')
var CryptoJS = require("crypto-js");
const key = require('../Config/config.json').keyCripto.key
const ValidUser = require('../Repositories/validerUser')
const Bitcoin = require('../Repositories/Bitcoin')
const bitcoin = new Bitcoin()
const EthereumController = require('./EthereumController')
var fs = require('fs')
//======payment==========/
const generateIdPedido = require('../Repositories/GenerateIdPedido')
const LatamGateway = require('../Repositories/LatamGateway')
const Payment = require('../Model/PaymentModel')

class User {
    static async idRegister(req, res) {
        try {
            const { firstName, secondName, IdDocument, mobile, telephone, email, login, password, nacionalidade, documentType, countryCode, mobileCode, value, type } = req.body

            const schema = yup.object().shape({
                firstName: yup.string().required('Primero nome Obrigatório'),
                secondName: yup.string().required('Segundo nome Obrigatório'),
                IdDocument: yup.string().required('CPF Obrigatório'),
                mobile: yup.string()
                    .matches(numberRegExp, 'O Telefone Mobile deve conter apenas números'),
                email: yup.string().email('E-mail Inválido').required('E-mail Obrigatório'),
                login: yup.string().required('Login Obrigatório'),
                password: yup.string()
                    .min(6, 'A sua senha deve conter entre 6 a 24 caracteres')
                    .max(120, 'A sua senha deve conter entre 6 a 24 caracteres')
                    .required('Senha Obrigatória'),
                nacionalidade: yup.string().required('Nacionalidade Obrigatória'),
                documentType: yup.string().required('documentType Obrigatório'),
                mobileCode: yup.string().required('mobileCode Obrigatório'),
            })
            await schema.validate(req.body)
            if (await Member.findOne({ where: { 'IdDocument': IdDocument } })) {
                return res.status(406).json({ error: { mensagen: 'Document already registered', flag: 'doc' } });
            }
            if (await Member.findOne({ where: { 'email': email } })) {
                return res.status(406).json({ error: { mensagen: 'E-mail already registered', flag: 'email' } });
            }
            if (await Member.findOne({ where: { 'mobile': mobile } })) {
                return res.status(406).json({ error: { mensagen: 'Cell phone already registered', flag: 'mobile' } });
            }
            if (await Member.findOne({ where: { 'login': login } })) {
                return res.status(406).json({ error: { mensagen: 'Username already registered', flag: 'login' } });
            }
            let hash = await bscrypt.hash("hashSecuryti", 10);
            const pass = await CryptoJS.MD5(password).toString()
            const member = await Member.create({ firstName, secondName, IdDocument, mobile, telephone, email, emailValidate: true, login, password: pass, nacionalidade, avatar: '', documentType, countryCode, IsAuth: 0, Hash: hash, statusVip: 0, mobileCode })
            const etherWallet = await EthereumController.createAccount()
            const bitcoinWallet = await bitcoin.createAccount()
            const walletEther = await Wallet.create({ uid: member.id, hash: etherWallet.address, privatekey: etherWallet.privateKey.replace('0x', ''), type: 1027, balance: 0 })
            const walletBitcoin = await Wallet.create({ uid: member.id, hash: bitcoinWallet.address, privatekey: bitcoinWallet.privateKey, type: 1, balance: 0 })
            // const walletLictoin = await Wallet.create({ uid: member.id, type: 2, balance: 0 })
            const walletIDSUEX = await Wallet.create({ uid: member.id, hash: etherWallet.address, privatekey: etherWallet.privateKey.replace('0x', ''), type: 12345, balance: 0 })
            const walletIDSSUS = await Wallet.create({ uid: member.id, type: 12343, balance: 0 })
            const walletIDCSC = await Wallet.create({ uid: member.id, type: 12342, balance: 0 })
            const walletIDSGC = await Wallet.create({ uid: member.id, type: 12341, balance: 0 })
            const walletTether = await Wallet.create({ uid: member.id, type: 825, balance: 0 })
            const walletReal = await Wallet.create({ uid: member.id, type: 0, balance: 0 })
            const idpedido = await generateIdPedido()
            const { bankSlug } = req.query
            const user = {
                "customer": {
                    "name": member.firstName + " " + member.secondName,
                    "document": member.IdDocument.replace('.', '').replace('-', ''),
                    "email": member.email,
                    "phone": member.mobile,
                    "birth": "01/01/2001"
                },
                "order": {
                    "code": idpedido,
                    "notification_url": "",
                    "value": value,
                    "additional_info": `${type} criado por ${member.firstName + " " + member.secondName} no valor de R$ ${value}`,
                    "payment_method": type
                }
            }
            if (type == 'deposit') {
                user.order.bank_slug = bankSlug
            }
            const latam = await LatamGateway.createPayment(user, res);
            if (latam.error) {
                console.error(latam)
                return res.status(400).json({ error: latam.error.message })
            } else {
                console.log(latam)
                if (latam.method == 'deposit') {
                    const payment = await Payment.create({ uid: member.id, type: type, status: 0, value: value, latam_id: latam.latam_id, code: latam.code, confirmationurl: latam.confirmation_url, idStatus: 1 })
                } else {
                    const payment = await Payment.create({ uid: member.id, type: type, status: 0, value: value, latam_id: latam.latam_id, code: latam.code, confirmationurl: latam.confirmation_url, qrcodeimage: latam.qrData.qrcode_image ? latam.qrData.qrcode_image : latam.qrData.qrcode_app_link, barcode: latam.qrData.barcode, pdf: latam.qrData.pdf, idStatus: 1 })
                }
            }
            return res.status(200).json(latam)

            //return res.status(200).json( {sucess:{ mensagen: 'Usuario Criado', flag: 'createUser' } })
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: { mensagen: 'error undefined', flag: 'erro' } })
        }
    }

    static async store(req, res) {
        try {
            const { firstName, secondName, IdDocument, mobile, telephone, email, login, password, nacionalidade, documentType, countryCode, mobileCode } = req.body
            console.log(req.body)
            const schema = yup.object().shape({
                firstName: yup.string().required('Primero nome Obrigatório'),
                secondName: yup.string().required('Segundo nome Obrigatório'),
                IdDocument: yup.string().required('CPF Obrigatório'),
                mobile: yup.string()
                    .matches(numberRegExp, 'O Telefone Mobile deve conter apenas números'),
                email: yup.string().email('E-mail Inválido').required('E-mail Obrigatório'),
                login: yup.string().required('Login Obrigatório'),
                password: yup.string()
                    .min(6, 'A sua senha deve conter entre 6 a 24 caracteres')
                    .max(120, 'A sua senha deve conter entre 6 a 24 caracteres')
                    .required('Senha Obrigatória'),
                nacionalidade: yup.string().required('Nacionalidade Obrigatória'),
                documentType: yup.string().required('documentType Obrigatório'),
                mobileCode: yup.string().required('mobileCode Obrigatório'),
            })
            await schema.validate(req.body)
            console.log(req.body)
            if (await Member.findOne({ where: { 'IdDocument': IdDocument } })) {
                return res.status(406).json({ error: { mensagen: 'Document already registered', flag: 'doc' } });
            }
            if (await Member.findOne({ where: { 'email': email } })) {
                return res.status(406).json({ error: { mensagen: 'E-mail already registered', flag: 'email' } });
            }
            if (await Member.findOne({ where: { 'mobile': mobile } })) {
                return res.status(406).json({ error: { mensagen: 'Cell phone already registered', flag: 'mobile' } });
            }
            if (await Member.findOne({ where: { 'login': login } })) {
                return res.status(406).json({ error: { mensagen: 'Username already registered', flag: 'login' } });
            }
            let hash = await bscrypt.hash("hashSecuryti", 10);
            const pass = await CryptoJS.MD5(password).toString()

            const member = await Member.create({ firstName, secondName, IdDocument, mobile, telephone, email, emailValidate: false, login, password: pass, nacionalidade, avatar: '', documentType, countryCode, IsAuth: 0, Hash: hash, statusVip: 0, mobileCode })
            const etherWallet = await EthereumController.createAccount()
            const bitcoinWallet = await bitcoin.createAccount()
            const walletEther = await Wallet.create({ uid: member.id, hash: etherWallet.address, privatekey: etherWallet.privateKey.replace('0x', ''), type: 1027, balance: 0 })
            const walletBitcoin = await Wallet.create({ uid: member.id, hash: bitcoinWallet.address,publickey:bitcoinWallet.publicKey, privatekey: bitcoinWallet.privateKey, type: 1, balance: 0 })
            // const walletLictoin = await Wallet.create({ uid: member.id, type: 2, balance: 0 })
            const walletIDSUEX = await Wallet.create({ uid: member.id, hash: etherWallet.address, privatekey: etherWallet.privateKey.replace('0x', ''), type: 12345, balance: 0 })
            const walletIDSSUS = await Wallet.create({ uid: member.id, type: 12343, balance: 0 })
            const walletIDCSC = await Wallet.create({ uid: member.id, type: 12342, balance: 0 })
            const walletIDSGC = await Wallet.create({ uid: member.id, type: 12341, balance: 0 })
            const walletTether = await Wallet.create({ uid: member.id, type: 825, balance: 0 })
            const walletReal = await Wallet.create({ uid: member.id, type: 0, balance: 0 })
            let authKey = {
                userHash: hash,
                id: member.id,
                IsAuth: member.IsAuth,
                IdDocument: member.IdDocument,

            }
            var cipherAuth = CryptoJS.AES.encrypt(JSON.stringify(authKey), key).toString();
            //remover id:user.id
            let responseUser = {
                id: member.id,
                authKey: cipherAuth,
                IsAuth: member.IsAuth,
                avatar: member.avatar,
                email: member.email,
                emailValidate: member.emailValidate,
                firstName: member.firstName,
                login: member.login,
                mobile: member.mobile,
                nacionalidade: member.nacionalidade,
                secondName: member.secondName,
                telephone: member.telephone,
                statusVip: member.statusVip,
                mobileCode: member.mobileCode
            };
            return res.status(200).json({
                member: responseUser
                
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: { mensagen: 'error tratar', flag: 'erro' } })
        }
    }

    static async update(req, res) {
        try {
            const { authKey, firstName, secondName, telephone, mobile, countryCode, mobileCode } = req.body;
            // console.log('a', authKey, typeDoc, typeUser)
            // console.log(req.file)
            let checkUser = await ValidUser.validUser(authKey)

            if (checkUser.sucess != undefined) {
                let id = checkUser.sucess.id
                let user = await Member.findByPk(id)


                user.firstName = firstName
                user.secondName = secondName
                if (telephone) {
                    user.telephone = telephone
                    user.countryCode = countryCode
                }
                user.mobileCode = mobileCode
                user.mobile = mobile
                await user.save()
                let member = await Member.findByPk(id)
                console.log(member)
                //remover id:user.id
                let responseUser = {
                    authKey: authKey,
                    IsAuth: member.IsAuth,
                    avatar: member.avatar,
                    email: member.email,
                    emailValidate: member.emailValidate,
                    firstName: member.firstName,
                    login: member.login,
                    mobile: member.mobile,
                    nacionalidade: member.nacionalidade,
                    secondName: member.secondName,
                    telephone: member.telephone,
                    statusVip: member.statusVip,
                    mobileCode: member.mobileCode,
                    countryCode: member.countryCode
                };
                return res.status(200).json(responseUser)
            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
        }

    }
    static async updateFile(req, res) {
        try {
            const { originalname: name, size, key, location: url = "" } = req.file;
            const { authKey, firstName, secondName, telephone, mobile, countryCode, mobileCode } = req.body;
            // console.log('a', authKey, typeDoc, typeUser)
            // console.log(req.file)
            let checkUser = await ValidUser.validUser(authKey)

            if (checkUser.sucess != undefined) {
                let id = checkUser.sucess.id
                let user = await Member.findByPk(id)
                //create folder 
                // let folderName = 'documents'
                // let aux = await createFolder(folderName)
                let folderName = '../Image/profile'
                //pega exteçao
                let arr = req.file.mimetype.split("/");
                let fileType = arr[1]
                let newfileName = req.file.key + "." + fileType

                // move file
                var oldPath = req.file.path
                var newPath = folderName + '/' + newfileName
                fs.rename(oldPath, newPath, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - AKA moved!')
                })

                // ///
                // if (user.avatar) {
                //     let delet = user.avatar.replaceAll('image', '../Image/profile')
                //     fs.unlinkSync(delet)
                //     console.log(delet);

                // }

                user.avatar = "image/" + newfileName
                console.log(firstName)
                user.firstName = firstName
                user.secondName = secondName
                if (telephone) {
                    user.telephone = telephone
                    user.countryCode = countryCode
                }
                user.mobileCode = mobileCode
                user.mobile = mobile
                await user.save()
                console.log("ok")
                let member = await Member.findByPk(id)
                console.log(member)
                let responseUser = {
                    authKey: authKey,
                    IsAuth: member.IsAuth,
                    avatar: member.avatar,
                    email: member.email,
                    emailValidate: member.emailValidate,
                    firstName: member.firstName,
                    login: member.login,
                    mobile: member.mobile,
                    nacionalidade: member.nacionalidade,
                    secondName: member.secondName,
                    telephone: member.telephone,
                    statusVip: member.statusVip,
                    mobileCode: member.mobileCode,
                    countryCode: member.countryCode
                };
                return res.status(200).json(responseUser)
                // let dataDocument = await Document.create({ uid: id, file: file, fileName: newfileName,typeDoc:typeDoc, typeUser: typeUser, fileType:fileType, cpf: user.IdDocument, status: 0 })

                //   //   const post = await Post.create({
                //   //     name,
                //   //     size,
                //   //     key,
                //   //     url
                //   //   });
                //   const folderName = 'documents/ user.IdDocument/' + typeUser
                //   

                //   return res.json();
                // });
                return res.status(200).json({ sucess: true });
            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: { mensagen: 'Erro  criar imagem', flag: "" } });
        }

    }
    static async checkPassword(req, res) {
        try {
            const { authKey, password, newPassword, confirmPassword } = req.body;
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let id = checkUser.sucess.id

                const user = await Member.findByPk(id)

                if (!user)
                    return res.status(406).json({ error: { mensagen: 'User not found', flag: "user" } });
                if (! await bcrypt.compare(password, user.password)) {
                    return res.status(406).json({ error: { mensagen: 'Incorrect current password.', flag: "oldPass" } });
                }
                if (newPassword !== confirmPassword)
                    return res.status(406).json({ error: { mensagen: 'Passwords do not match.', flag: "newPass" } });
                return res.status(200).json({ sucess: true })
            }
            else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }
            }
        } catch (err) {
            res.status(400).json({ err: 'Error changing password, please try later.' });
        }

    }
    static async confirmRemove2FA(req, res) {
        try {
            const { idUser, token } = req.body;
            const user = await Member.findByPk(idUser)

            if (!user)
                return res.status(400).json({ error: 'Usuário não encontrado' });

            if (token !== user.emailTokeValidate)
                return res.status(400).json({ error: 'Token inválido' });
            const now = new Date();
            if (now > user.emailValidateExpires)
                return res.status(400).json({ error: 'Tempo expirou, tente novamente!' });
            user.IsAuth = 0
            await user.save();
            return res.status(200).json({ sucess: true });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    } static async confirmRemove2FA(req, res) {
        try {
            const { idUser, token } = req.body;
            const user = await Member.findByPk(idUser)

            if (!user)
                return res.status(400).json({ error: 'Usuário não encontrado' });

            if (token !== user.emailTokeValidate)
                return res.status(400).json({ error: 'Token inválido' });
            const now = new Date();
            if (now > user.emailValidateExpires)
                return res.status(400).json({ error: 'Tempo expirou, tente novamente!' });
            user.IsAuth = 0
            await user.save();
            return res.status(200).json({ sucess: true });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
    static async resetPassword(req, res) {
        try {
            const { authKey, token, pass } = req.body;
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let id = checkUser.sucess.id
                const user = await Member.findByPk(id)

                if (!user)
                    return res.status(400).json({ error: 'Usuário não encontrado' });

                if (token !== user.emailTokeValidate)
                    return res.status(400).json({ error: 'Token inválido' });
                const now = new Date();
                if (now > user.emailValidateExpires)
                    return res.status(400).json({ error: 'Tempo expirou, tente novamente!' });
                user.password = await bcrypt.hash(pass, 10);
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
            res.status(400).json({ error: "Falha em alterar senha" });
        }

    }
    static async updateEmail(req, res) {
        try {
            const { id } = req.params
            const { email } = req.body
            console.log(email)
            const schema = yup.object().shape({
                email: yup.string().email('E-mail Inválido').required('E-mail Obrigatório'),

            })
            await schema.validate(req.body)
            const user = await Member.findByPk(id)
            user.email = email
            user.emailValidate = false;
            user.save()
            const data = await Member.findByPk(id)
            return res.status(200).json(data)
        }
        catch (err) {
            res.status(400).json(err);
        }

    }
    static async delet(req, res) {
        try {
            const { email } = req.params
            const user = await Member.destroy({ where: { email } })
            return res.json(user)
        } catch (err) {
            console.log(err)
        }

    }
    static async validTwoFactor(req, res) {

        try {
            const { authKey } = req.body;
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let id = checkUser.sucess.id
                const user = await Member.findByPk(id)
                if (user.IsAuth == 1) {
                    res.status(200).json(true)

                } else {
                    res.status(200).json(false)
                }
            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }
        } catch (err) {
            console.log(err)
            res.status(400).json({ err: 'erro valid two factor. code: 004' });
        }
    }
    static async checkTwoFactor(req, res) {

        try {
            const { authKey } = req.body;
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let id = checkUser.sucess.id
                const user = await Member.findByPk(id)
                if (user.IsAuth == 1) {
                    res.status(200).json(true)

                } else {
                    res.status(200).json(false)
                }
            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }



        } catch (err) {
            console.log(err)
            res.status(400).json({ err: 'erro check two factor. code: 003' });
        }

    }
    static async confirmTwoFactor(req, res) {
        try {
            const { authKey } = req.body;
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let id = checkUser.sucess.id
                const user = await Member.findByPk(id)
                user.IsAuth = 1
                await user.save();
                res.status(200).json()
            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }

        } catch (err) {
            console.log(err)
            res.status(400).json({ err: 'erro confirm two factor. code: 002' });
        }

    }
    static async createTwoFactor(req, res) {

        try {
            const { authKey } = req.body;
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let id = checkUser.sucess.id
                const user = await Member.findByPk(id)
                if (user.IsAuth != 1) {
                    var secret = speakeasy.generateSecret({
                        name: ""
                    })
                    user.AuthToken = secret.ascii
                    await user.save();
                    qrcode.toDataURL(secret.otpauth_url, function (err, data) {
                        res.status(200).json(data)

                    })
                } else {
                    res.status(400).json({ err: 'erro create two factor' });
                }
            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }


        } catch (err) {
            console.log(err)
            res.status(400).json({ err: 'erro create two factor' });
        }

    }
    static async logout(req, res) {
        const { authKey } = req.body;
        try {
            var bytes = await CryptoJS.AES.decrypt(authKey, key);
            var userHash = await JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            const user = await Member.findByPk(userHash.id)
            let hash = await bscrypt.hash("hashSecuryti", 10);
            user.Hash = hash
            await user.save();
            res.status(200).json();
        } catch (error) {
            res.status(400).json({ err: 'erro' });
        }
    }
    static async validUser(req, res) {
        try {
            const { authKey } = req.body;
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                return res.status(200).json({ sucess: true });
            } else {
                if (checkUser.flag == 'user') {
                    return res.status(406).json({ error: { mensagen: 'invalid user', flag: "" } })
                } else {
                    return res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
                }

            }
        } catch (error) {
            res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
        }
    }

}

module.exports = User