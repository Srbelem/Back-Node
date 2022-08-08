const { Model, DataTypes } = require('sequelize')
class Documents extends Model {
    static init(sequelize) {
        super.init({
            uid: {
                type: DataTypes.INTEGER
            },
            file: {
                type: DataTypes.STRING,
            },
            cpf: {
                type: DataTypes.STRING,
            },
            typeDoc: {
                type: DataTypes.STRING,
            },
            fileName: {
                type: DataTypes.STRING,
            },
            status: {
                type: DataTypes.INTEGER
            },
            typeUser:{
                type: DataTypes.STRING,
            },
            fileType:{
                type: DataTypes.STRING,
            }
        }, {
            sequelize,
            tableName: 'documents',
            modelName: 'documents'
        })
    }
}

module.exports = Documents