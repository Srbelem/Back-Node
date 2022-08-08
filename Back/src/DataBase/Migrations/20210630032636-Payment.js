'use strict';
const sequelize = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payment', {
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
      value:{
        type: Sequelize.FLOAT,
        alloNull:false
      },
      latam_id:{
        type:Sequelize.STRING,
        alloNull:false,
      },
      code:{
        type: Sequelize.INTEGER,
        alloNull:false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      idStatus:{
        type: Sequelize.INTEGER,
        alloNull:false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payment');
  }
};