const { Model, DataTypes } = require('sequelize')
const sequelize = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('withdrawfiat', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize.INTEGER
      },
      uid: {
        type: sequelize.INTEGER,
        alloNull: false,
        references: {
          model: 'member',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      type: {
        type: sequelize.INTEGER,
        alloNull: false,
      },
      account: {
        type: sequelize.INTEGER,
        references: {
          model: 'accountBank',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      pix: {
        type: sequelize.INTEGER,
        references: {
          model: 'pix',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: sequelize.INTEGER,
        alloNull: false,
      },
      quantity: {
        type: sequelize.FLOAT
      },
      tax: {
        type: sequelize.FLOAT
      },
      coinType: {
        type: sequelize.INTEGER,
        alloNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      holderName: {
        type: Sequelize.STRING,
      },
    });
  },
  down: async (queryInterface, sequelize) => {
    await queryInterface.dropTable('withdrawfiat');
  }
};