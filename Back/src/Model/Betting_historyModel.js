const { Model, DataTypes } = require('sequelize')
class Betting_history extends Model {
    static init(sequelize) {
        super.init({
            ID: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            UID: {
                type: DataTypes.INTEGER,
                alloNull: false
            },
            // initial_date: {
            //     type: DataTypes.DATE(6),
            //     alloNull: false
            // },
            initial_date: {
                type: DataTypes.STRING,
                alloNull: false
            },
            value_bet: {
                type: DataTypes.FLOAT,
                alloNull: false
            },
            // final_date: {
            //     type: DataTypes.DATE(6),
            //     alloNull: false
            // },
            final_date: {
                type: DataTypes.STRING,
                alloNull: false
            },
            bet_time: {
                type: DataTypes.STRING,
                alloNull: false
            },
            result_type: {
                type: DataTypes.STRING,
                alloNull: false
              },
              win_bet: {
                type: DataTypes.FLOAT,
                alloNull: false
              }
        }, {
            sequelize,
            tableName: 'betting_history',
            modelName: 'betting_history'
        })
    }
}

module.exports = Betting_history