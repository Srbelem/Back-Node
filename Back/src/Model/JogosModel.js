const { Model, DataTypes } = require('sequelize')
class Jogos extends Model {
    static init(sequelize) {
        super.init({
            hora: {
                type: DataTypes.STRING,
                alloNull: false

            },
            tempo: {
                type: DataTypes.STRING,
                alloNull: false
            }
        }, {
            sequelize,
            tableName: 'jogos',
            modelName: 'jogos'
        })
    }
}

module.exports = Jogos