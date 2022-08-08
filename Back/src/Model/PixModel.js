const { Model, DataTypes } = require('sequelize')
class Pix extends Model {
    static init(sequelize) {
        super.init({
            uid: {
                type: DataTypes.INTEGER,
                alloNull: false,
              },
              name: {
                type: DataTypes.STRING,
                alloNull: false,
              },
              typePix: {
                type: DataTypes.STRING,
                alloNull: false,
              },
              pix: {
                type: DataTypes.STRING,
                alloNull: false,
              },
              holderName:{
                type: DataTypes.STRING,
                alloNull: false,
              },
        }, {
            sequelize,
            tableName: 'pix',
            modelName: 'pix'
        })
    }
}

module.exports = Pix