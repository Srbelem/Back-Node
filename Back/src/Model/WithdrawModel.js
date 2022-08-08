const { Model, DataTypes } = require('sequelize')
class Withdraw extends Model {
    static init(sequelize) {
        super.init({
            uid: {
                type: DataTypes.INTEGER,
                alloNull: false,
            },
            type: {
                type: DataTypes.STRING,
                alloNull: false,
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
            hash: {
                type: DataTypes.STRING
            },
            coinType: {
                type: DataTypes.INTEGER,
                alloNull: false
            },
            receiverAddress: {
                type: DataTypes.STRING
            }
        }, {
            sequelize,
            tableName: 'withdraw',
            modelName: 'withdraw'
        })
    }
    static associate(models) {
        this.belongsTo(models.members, { foreignKey: 'uid', as: 'user' })
      }
}

module.exports = Withdraw