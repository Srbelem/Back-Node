const { Model, DataTypes } = require('sequelize')

class Transaction extends Model {
  static init(sequelize) {
    super.init({
      description: {
        type: DataTypes.STRING
      },
      receiver: {
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
      txHash: {
        type: DataTypes.STRING
      },
      to: {
        type: DataTypes.STRING
      },
      from: {
        type: DataTypes.STRING
      },
      confirmations: {
        type: DataTypes.INTEGER
      },
      contractaddress: {
        type: DataTypes.STRING
      },
      value: {
        type: DataTypes.FLOAT
      },
      gas: {
        type: DataTypes.FLOAT
      },
      tax: {
        type: DataTypes.FLOAT
      },
    }, {
      sequelize,
      tableName: 'exTransfer',
      modelName: 'exTransfer'
    })
  }
  static associate(models) {
    this.belongsTo(models.members, { foreignKey: 'receiver', as: 'Receiver' })
  }
}

module.exports = Transaction