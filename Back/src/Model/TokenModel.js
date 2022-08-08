const { Model, DataTypes } = require('sequelize')
class Token extends Model {
    static init(sequelize) {
        super.init({
            token: {
                type: DataTypes.STRING,
                alloNull: false,
                unique: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                alloNull: false,
            },
        }, {
            sequelize,
            tableName: 'token',
            modelName: 'tokens'
        })
    }
    static associate(models) {
        this.belongsTo(models.members, { foreignKey: 'user_id', as: 'user' })
    }
}

module.exports = Token