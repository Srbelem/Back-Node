const { Model, DataTypes } = require('sequelize')
class StatusVip extends Model {
    static init(sequelize) {
        super.init({
            limit: {
                type: DataTypes.FLOAT,
                alloNull: false,
            },
            status: {
                type: DataTypes.INTEGER,
                alloNull: false,
            }
        }, {
            sequelize,
            tableName: 'statusVip',
            modelName: 'statusVip'
        })
    }
}

module.exports = StatusVip