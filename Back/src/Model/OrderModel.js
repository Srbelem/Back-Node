const { Model, DataTypes } = require('sequelize')
class Order extends Model {
    static init(sequelize) {
        super.init({
            description: {
                type: DataTypes.STRING
            },
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
            priceMedia: {
                type: DataTypes.FLOAT
            },
            finalValue: {
                type: DataTypes.FLOAT
            },
            quantity: {
                type: DataTypes.FLOAT
            },
            tax: {
                type: DataTypes.FLOAT
            },
            dispare: {
                type: DataTypes.FLOAT
            },
            inputType: {
                type: DataTypes.INTEGER,
                alloNull: false
            },
            outputType: {
                type: DataTypes.INTEGER,
                alloNull: false
            },
        }, {
            sequelize,
            tableName: 'order',
            modelName: 'order'
        })
    }
    static associate(models) {
        this.belongsTo(models.members, { foreignKey: 'uid', as: 'user' })
      }
}

module.exports = Order