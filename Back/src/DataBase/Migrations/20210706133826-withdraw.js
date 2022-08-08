'use strict';
const sequelize = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('withdraw', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uid: {
        type: sequelize.INTEGER,
        alloNull: false,
        references:{
          model:'member',
          key:'id'
      },
        onUpdate:'CASCADE',
        onDelete:'CASCADE'
      },
      type:{
        type:Sequelize.STRING,
        alloNull:false,
      },
      status: {
        type: Sequelize.INTEGER,
        alloNull:false,
      },
      quantity: {
        type: Sequelize.FLOAT
      },
      tax: {
        type: Sequelize.FLOAT
      },
      hash: {
        type: Sequelize.STRING
      },
      coinType:{
        type:Sequelize.INTEGER,
        alloNull:false
      },
      receiverAddress: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('withdraw');
  }
};