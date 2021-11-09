"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Restaurants", "oping_hours");
    await queryInterface.addColumn("Restaurants", "opening_hours", {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Restaurants", "oping_hours", {
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn("Restaurants", "opening_hours");

  },
};
