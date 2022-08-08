const { Model, DataTypes } = require('sequelize')
class AccountBank extends Model {
    static init(sequelize) {
        super.init({
            uid: {
                type: DataTypes.INTEGER,
                alloNull: false,
              },
              bank: {
                type: DataTypes.STRING,
                alloNull: false,
              },
              accountType: {
                type: DataTypes.STRING,
                alloNull: false,
              },
              account: {
                type: DataTypes.STRING,
                alloNull: false,
              },
              digit: {
                type: DataTypes.STRING,
                alloNull: false,
              },
              agency: {
                type: DataTypes.STRING,
                alloNull: false,
              },
              holderName:{
                type: DataTypes.STRING,
                alloNull: false,
              },
        }, {
            sequelize,
            tableName: 'accountBank',
            modelName: 'accountBank'
        })
    }
}

module.exports = AccountBank