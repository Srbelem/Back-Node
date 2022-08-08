const { Model, DataTypes } = require('sequelize')
class Bank extends Model {
    static init(sequelize) {
        super.init({
            cod: {
                type: DataTypes.STRING,
              },
              titulo: {
                type: DataTypes.STRING,
              },
              documento: {
                type: DataTypes.STRING,
              },
              site: {
                type: DataTypes.STRING,
              },
              status: {
                type: DataTypes.INTEGER,
              },
        }, {
            sequelize,
            tableName: 'bancos',
            modelName: 'bancos'
        })
    }
}

module.exports = Bank
