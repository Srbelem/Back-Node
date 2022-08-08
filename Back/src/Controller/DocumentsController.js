const Member = require('../Model/MemberModel')
const ValidUser = require('../Repositories/validerUser')
const Document = require('../Model/DocumentsModel')
var fs = require('fs')


async function createFolder(folder) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder)
    }
    return
}
class Documents {

    static async sendDocuments(req, res) {
        try {
            const { originalname: name, size, key, location: url = "" } = req.file;
            const { authKey, typeDoc, typeUser } = req.body;
            // console.log('a', authKey, typeDoc, typeUser)
            // console.log(req.file)
            let checkUser = await ValidUser.validUser(authKey)

            if (checkUser.sucess != undefined) {
                let id = checkUser.sucess.id
                const user = await Member.findByPk(id)
                //create folder 
                let folderName = 'documents'
                let aux = await createFolder(folderName)
                folderName = '../documents/upload'
                await createFolder(folderName)
                //pega exteçao
                let arr = req.file.mimetype.split("/");
                let fileType=arr[1]
                let newfileName = req.file.key +"-"+typeUser+"-"+ user.IdDocument +"."+fileType
                
                // move file
                var oldPath = req.file.path
                var newPath = folderName + '/' +newfileName
                fs.rename(oldPath, newPath, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - AKA moved!')
                })

                ///
                let file ="files/"+newfileName
                let dataDocument = await Document.create({ uid: id, file: file, fileName: newfileName,typeDoc:typeDoc, typeUser: typeUser, fileType:fileType, cpf: user.IdDocument, status: 0 })

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
            res.status(400).json({ error: { mensagen: 'invalid user', flag: "" } });
        }
    }
    static async getDocuments(req, res) {
        try {
            const { authKey } = req.body;
            let checkUser = await ValidUser.validUser(authKey)
            if (checkUser.sucess != undefined) {
                let id = checkUser.sucess.id
                let documentsUser = await Document.findAll({ attributes: [ 'createdAt', 'status', 'fileType', 'typeDoc', 'cpf'], where: { uid: id ,typeUser:'toUser'} })
                let documentsDepend = await Document.findAll({ attributes: [ 'createdAt', 'status', 'fileType', 'typeDoc', 'cpf'], where: { uid: id ,typeUser:'toDepend'} })
                let documents={documentsUser,documentsDepend}
                return res.status(200).json(documents);
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

module.exports = Documents