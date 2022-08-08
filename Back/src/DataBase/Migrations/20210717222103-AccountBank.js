const { Model, DataTypes } = require('sequelize')
const sequelize = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('accountBank', {
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
      bank: {
        type: sequelize.STRING,
        alloNull: false,
      },
      accountType: {
        type: sequelize.STRING,
        alloNull: false,
      },
      account: {
        type: sequelize.STRING,
        alloNull: false,
      },
      digit: {
        type: sequelize.STRING,
        alloNull: false,
      },
      agency: {
        type: sequelize.STRING,
        alloNull: false,
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
        type: sequelize.STRING,
        alloNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('accountBank');
  }
};