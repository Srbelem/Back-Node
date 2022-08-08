const { Model, DataTypes } = require('sequelize')
class Price extends Model {
    static init(sequelize) {
        super.init({
            hora: {
                type: DataTypes.STRING,
                alloNull: false

            },
            tempo: {
                type: DataTypes.STRING,
                alloNull: false
            }
        }, {
            sequelize,
            tableName: 'priceMarket',
            modelName: 'priceMarket'
        })
    }
}

module.exports = Price