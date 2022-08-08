'use strict';
const sequelize = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('wallet', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hash: {
        type: Sequelize.STRING
      },
      publickey: {
        type: Sequelize.STRING
      },
      privatekey: {
        type: Sequelize.STRING
      },
      status: {
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
      type: {
        type: Sequelize.INTEGER
      },
      mnemonic: {
        type: Sequelize.STRING
      },
      balance:{
        type:Sequelize.DOUBLE,
        allowNull: false,
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
    await queryInterface.dropTable('wallet');
  }
};