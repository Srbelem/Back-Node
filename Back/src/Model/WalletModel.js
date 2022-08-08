const { Model, DataTypes } = require('sequelize')
class Wallet extends Model {
    static init(sequelize) {
        super.init({
            hash: {
              type: DataTypes.STRING
            },
            publickey: {
              type: DataTypes.STRING
            },
            privatekey: {
              type: DataTypes.STRING
            },
            status: {
              type: DataTypes.INTEGER
            },
            uid: {
              type: DataTypes.INTEGER,
              alloNull: false,
            },
            type: {
              type: DataTypes.INTEGER
            },
            mnemonic: {
              type: DataTypes.STRING
            },
            balance: {
              type: DataTypes.DOUBLE,
              allowNull: false,
            },
          }, {
            sequelize,
            tableName: 'wallet',
            modelName: 'wallet'
          })
    }
    static associate(models) {
        this.belongsTo(models.members,{foreignKey:'uid',as:'user'})
      }
}
module.exports = Wallet