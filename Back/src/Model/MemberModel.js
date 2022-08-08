const { Model, DataTypes } = require('sequelize')
class Member extends Model {
    static init(sequelize) {
        super.init({
            firstName: {
                type: DataTypes.STRING,
                alloNull: false
            },
            secondName: {
                type: DataTypes.STRING,
                alloNull: false,
            },
            IdDocument: {
                type: DataTypes.STRING,
                alloNull: false,
                unique: true
            },
            mobile: {
                type: DataTypes.STRING,
                alloNull: false
            },
            telephone: {
                type: DataTypes.STRING,
                alloNull: false
            },
            email: {
                type: DataTypes.STRING,
                alloNull: false
            },
            login: {
                type: DataTypes.STRING,
                alloNull: false,

            },
            password: {
                type: DataTypes.STRING,
                alloNull: false,
            },
            emailValidate: {
                type: DataTypes.BOOLEAN,
                alloNull: false,
            },
            emailTokeValidate: {
                type: DataTypes.STRING,
            },
            emailValidateExpires: {
                type: DataTypes.DATE
            },
            passwordResetToken: {
                type: DataTypes.STRING
            },
            avatar: {
                type: DataTypes.STRING
            },
            nacionalidade: {
                type: DataTypes.STRING
            },
            documentType: {
                type: DataTypes.STRING
            },
            countryCode: {
                type: DataTypes.STRING
            },
            IsAuth: {
                type: DataTypes.INTEGER
            },
            AuthToken: {
                type: DataTypes.STRING
            },
            Hash: {
                type: DataTypes.STRING
            },
            statusVip: {
                type: DataTypes.INTEGER
            },
            mobileCode: {
                type: DataTypes.STRING
            }

        }, {
            sequelize,
            tableName: 'member',
            modelName: 'members'
        })
    }
    static associate(models) {
        this.hasMany(models.wallet, { foreignKey: 'uid', as: 'Wallets' })
        this.hasMany(models.transaction, { foreignKey: 'uid', as: 'Transactions' })
        this.hasMany(models.transaction, { foreignKey: 'receiver', as: 'TransactionsReceiver' })
        this.hasMany(models.order, { foreignKey: 'uid', as: 'Orders' })
        this.hasMany(models.tokens, { foreignKey: 'user_id', as: 'Tokens' })
        this.hasMany(models.payment, { foreignKey: 'uid', as: 'Payments' })
        this.hasMany(models.withdraw, { foreignKey: 'uid', as: 'Withdraws' })
        this.hasMany(models.withdrawFiat, { foreignKey: 'uid', as: 'WithdrawFiat' })
        this.hasMany(models.interntransfer, { foreignKey: 'uid', as: 'InternTransfers' })
        this.hasMany(models.interntransfer, { foreignKey: 'uuid', as: 'ReceiverInternTransfers' })

    }
}
module.exports = Member