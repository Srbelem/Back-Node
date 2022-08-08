const axios = require('axios')
const Member = require('../Model/MemberModel')
const bscrypt = require('bcryptjs')
var CryptoJS = require("crypto-js")
const key = require('../Config/config.json').keyCripto.key

class ValidUser {
    static async validUser(authKey) {
        try {
            var bytes = await CryptoJS.AES.decrypt(authKey, key);
            var userHash = await JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            let id =userHash.id
            const user = await Member.findByPk(userHash.id)
            if (user.Hash == userHash.userHash) {
                return { sucess: {status:true, id:id} }
            } else {
                let hash = await bscrypt.hash("hashSecuryti", 10);
                user.Hash = hash
                await user.save();
                return { mensagen: 'invalid user', flag: "user" };
            }
        } catch (err) {
            return { mensagen: 'invalid user', flag: "erro" };
        }
    }

}
module.exports = ValidUser;