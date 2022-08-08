'use strict';
const sequelize = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('price', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      coin: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.FLOAT,
        alloNull:false,
      },
      market_cap: {
        type: Sequelize.FLOAT
      },
      percent_change: {
        type: Sequelize.FLOAT
      },
      daily_percent_change: {
        type: Sequelize.FLOAT
      },
      daily_volume: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      coin: {
        type: Sequelize.INTEGER
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      token_hash: {
        type: sequelize.STRING
      },
      decimais: {
        type: Sequelize.INTEGER
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('price');
  }
};