const { Model, DataTypes } = require('sequelize')
class GasPrice extends Model {
    static init(sequelize) {
        super.init({
            type: {
                type: DataTypes.STRING
            },
            price: {
                type: DataTypes.FLOAT,
                alloNull: false
            },
        }, {
            sequelize,
            tableName: 'gasprice',
            modelName: 'gasprice'
        })
    }
}

module.exports = GasPrice