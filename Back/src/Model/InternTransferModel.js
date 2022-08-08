const { Model, DataTypes } = require('sequelize')
class InternTransfer extends Model {
    static init(sequelize) {
        super.init({
            uid: {
                type: DataTypes.INTEGER,
                alloNull: false,
            },
            uuid: {
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
            tableName: 'interntransfer',
            modelName: 'interntransfer'
        })
    }
    static associate(models) {
        this.belongsTo(models.members, { foreignKey: 'uid', as: 'user' })
        this.belongsTo(models.members, { foreignKey: 'uuid', as: 'receiver' })
      }
}

module.exports = InternTransfer