'use strict';
const sequelize = require('sequelize');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('member', {
      id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        alloNull: false,
        unique: true
      },
      firstName: {
        type: sequelize.STRING,
        alloNull: false

      },
      secondName: {
        type: sequelize.STRING,
        alloNull: false

      },
      IdDocument: {
        type: sequelize.STRING,
        alloNull: false,
        unique: true
      },
      mobile: {
        type: sequelize.STRING,
        alloNull: false,
        unique: true
      },
      telephone: {
        type: sequelize.STRING,
        alloNull: false
      },
      email: {
        type: sequelize.STRING,
        alloNull: false,
        unique: true
      },
      type: {
        type: sequelize.INTEGER,
        alloNull: false
      },
      login: {
        type: sequelize.STRING,
        alloNull: false,
        unique: true
      },
      password: {
        type: sequelize.STRING,
        alloNull: false
      },
      emailValidate: {
        type: sequelize.BOOLEAN,
        alloNull: false,
      },
      emailTokeValidate: {
        type: sequelize.STRING,
      },
      emailValidateExpires: {
        type: sequelize.DATE
      },
      passwordResetToken: {
        type: sequelize.STRING
      },
      passwordResetExpires: {
        type: sequelize.DATE
      },
      avatar: {
        type: sequelize.STRING
      },
      nacionalidade: {
        type: sequelize.STRING
      },
      documentType: {
        type: sequelize.STRING
      },
      countryCode: {
        type: sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      IsAuth: {
        type: sequelize.INTEGER
      },
      AuthToken: {
        type: sequelize.STRING
      },
      Hash: {
        type: sequelize.STRING
      },
      statusVip: {
        type: sequelize.INTEGER
      },
      mobileCode: {
        type: sequelize.STRING
      }
    })

  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('member')
  }
};
