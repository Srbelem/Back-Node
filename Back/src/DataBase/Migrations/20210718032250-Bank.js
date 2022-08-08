'use strict';
const sequelize = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bancos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize.INTEGER
      },
      cod: {
        type: sequelize.STRING,
        alloNull: false,
      },
      titulo: {
        type: sequelize.STRING,
        alloNull: false,
      },
      documento: {
        type: sequelize.STRING,
        alloNull: false,
      },
      site: {
        type: sequelize.STRING,
        alloNull: false,
      },
      status: {
        type: sequelize.INTEGER,
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bancos');
  }
};