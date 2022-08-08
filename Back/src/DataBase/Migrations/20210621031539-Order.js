'use strict';
const sequelize = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order', {
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
      type:{
        type:Sequelize.STRING,
        alloNull:false,
      },
      status: {
        type: Sequelize.INTEGER,
        alloNull:false,
      },
      priceMedia: {
        type: Sequelize.FLOAT
      },
      finalValue: {
        type: Sequelize.FLOAT
      },
      quantity: {
        type: Sequelize.FLOAT
      },
      tax: {
        type: Sequelize.FLOAT
      },
      dispare: {
        type: Sequelize.FLOAT
      },
      inputType:{
        type:Sequelize.INTEGER,
        alloNull:false
      },
      outputType:{
        type:Sequelize.INTEGER,
        alloNull:false
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
    await queryInterface.dropTable('order');
  }
};