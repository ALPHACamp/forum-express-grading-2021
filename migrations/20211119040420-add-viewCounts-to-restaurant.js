'use strict';

const { query } = require("express");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurants', 'viewCounts', {
      type: Sequelize.INTEGER,
      defaultValue: 0,

    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.remoteColumn('Restaurantss', 'viewCounts')
  }
};
