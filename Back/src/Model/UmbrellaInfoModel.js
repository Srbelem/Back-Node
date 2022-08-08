const { Model, DataTypes } = require('sequelize')
class UmbrellaInfo extends Model {
    static init(sequelize) {
        super.init({
            currentBlock: {
                type: DataTypes.INTEGER
            },
            uid: {
                type: DataTypes.INTEGER
            },
            inProcess: {
                type: DataTypes.BOOLEAN
            },
            count: {
                type: DataTypes.INTEGER
              },
        }, {
            sequelize,
            tableName: 'umbrellaInfo',
            modelName: 'umbrellaInfo'
        })
    }
}

module.exports = UmbrellaInfo