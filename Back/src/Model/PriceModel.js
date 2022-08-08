const { Model, DataTypes } = require('sequelize')
class Price extends Model {
    static init(sequelize) {
        super.init({
            uid: {
                type: DataTypes.INTEGER
            },
            initial_date: {
                type: DataTypes.STRING,
                alloNull: false
            },
            value_bet: {
                type: DataTypes.FLOAT
            },
            final_date: {
                type: DataTypes.STRING
            },
            bet_time: {
                type: DataTypes.STRING
            },
            result_type: {
                type: DataTypes.STRING,
            },
            win_bet: {
                type: DataTypes.FLOAT,
            }
        }, {
            sequelize,
            tableName: 'price',
            modelName: 'price'
        })
    }
}

module.exports = Price