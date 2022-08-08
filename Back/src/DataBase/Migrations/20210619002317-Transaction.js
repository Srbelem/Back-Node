'use strict';
const sequelize = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transaction', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
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
      receiver: {
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
      txHash: {
        type: Sequelize.STRING
      },
      to: {
        type: Sequelize.STRING
      },
      from: {
        type: Sequelize.STRING
      },
      confirmations: {
        type: Sequelize.INTEGER
      },
      contractaddress: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.FLOAT
      },
      gas: {
        type: Sequelize.FLOAT
      },
      tax: {
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('transaction');
  }
};