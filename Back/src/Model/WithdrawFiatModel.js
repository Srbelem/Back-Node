const { Model, DataTypes } = require('sequelize')
class WithdrawFiat extends Model {
    static init(sequelize) {
        super.init({
            uid: {
                type: DataTypes.INTEGER,
                alloNull: false,
              },
              type: {
                type: DataTypes.INTEGER,
                alloNull: false,
              },
              account: {
                type: DataTypes.INTEGER,
              },
              pix:{
                type: DataTypes.INTEGER,
              },
              status: {
                type: DataTypes.INTEGER,
                alloNull: false,
              },
              quantity: {
                type: DataTypes.FLOAT
              },
              tax: {
                type: DataTypes.FLOAT
              },
              coinType: {
                type: DataTypes.INTEGER,
                alloNull: false
              },
              holderName: {
                type: DataTypes.STRING
            },
        }, {
            sequelize,
            tableName: 'withdrawfiat',
            modelName: 'withdrawFiat'
        })
    }
    static associate(models) {
        this.belongsTo(models.members, { foreignKey: 'uid', as: 'user' })
        this.belongsTo(models.accountBank, { foreignKey: 'uid', as: 'accountbank' })
    }
}

module.exports = WithdrawFiat