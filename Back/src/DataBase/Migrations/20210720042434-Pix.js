const { Model, DataTypes } = require('sequelize')
const sequelize = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pix', {
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
      name: {
        type: sequelize.STRING,
        alloNull: false,
      },
      typePix: {
        type: sequelize.STRING,
        alloNull: false,
      },
      pix: {
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
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pix');
  }
};