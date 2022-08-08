const { Model, DataTypes } = require('sequelize')
class UmbrelaPrice extends Model {
    static init(sequelize) {
        super.init({
            uid: {
                type: DataTypes.INTEGER
            },
            price: {
                type: DataTypes.FLOAT,
                alloNull: false
            },
            data: {
                type: DataTypes.STRING
            },
            uuid: {
                type: DataTypes.INTEGER
            },
        }, {
            sequelize,
            tableName: 'umbrellaPrice',
            modelName: 'umbrellaPrice'
        })
    }
}

module.exports = UmbrelaPrice