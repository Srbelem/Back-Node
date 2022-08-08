'use strict';
const sequelize = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('umbrellaPrice', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uid: {
        type: Sequelize.INTEGER, 
      },
      price: {
        type: Sequelize.FLOAT,
        alloNull:false,
      },
      data: {
        type: Sequelize.STRING, 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      uuid: {
        type: Sequelize.INTEGER, 
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('umbrellaPrice');
  }
};
