'use strict';

const sequelize = require('sequelize')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('token', {
      id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        alloNull: false,
        unique: true
      },
      token: {
        type: sequelize.STRING,
        alloNull: false,
        unique:true

      },
      user_id:{
        type: sequelize.INTEGER,
        alloNull: false,
        references:{
          model:'member',
          key:'id'
        },
        onUpdate:'CASCADE',
        onDelete:'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })

  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('token')
  }
};
