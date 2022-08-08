const { Model, DataTypes } = require('sequelize')
class Payment extends Model {
    static init(sequelize) {
        super.init({
            uid: {
                type: DataTypes.INTEGER,
                alloNull: false,
              },
              type:{
                type:DataTypes.STRING,
                alloNull:false,
              },
              status: {
                type: DataTypes.INTEGER,
                alloNull:false,
              },
              value:{
                type: DataTypes.FLOAT,
                alloNull:false
              },
              latam_id:{
                type:DataTypes.STRING,
                alloNull:false,
              },
              code:{
                type: DataTypes.INTEGER,
                alloNull:false,
              },
              confirmationurl:{
                type:DataTypes.STRING,
              },
              qrcodeimage:{
                type:DataTypes.STRING,
              },
              barcode:{
                type:DataTypes.STRING,
              },
              pdf:{
                type:DataTypes.STRING,
              },
              idStatus:{
                type:DataTypes.INTEGER,
              }
        }, {
            sequelize,
            tableName: 'payment',
            modelName: 'payment'
        })
    }
    static associate(models) {
        this.belongsTo(models.members, { foreignKey: 'uid', as: 'user' })
      }
}

module.exports = Payment