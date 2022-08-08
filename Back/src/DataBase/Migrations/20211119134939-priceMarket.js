'use strict';
const sequelize = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('priceMarket', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      coin: {
        type: Sequelize.INTEGER
      },
      code: {
        type: sequelize.STRING
      },
      high: {
        type: Sequelize.FLOAT,
        alloNull: false,
      },
      low: {
        type: Sequelize.FLOAT
      },
      varBid: {
        type: Sequelize.FLOAT
      },
      pctChange: {
        type: Sequelize.FLOAT
      },
      bid: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      ask: {
        type: Sequelize.FLOAT
      },
      uid: {
        type: Sequelize.INTEGER
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('priceMarket');
  }
};