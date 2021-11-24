'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn( 'Users', 'image', {
      type: Sequelize.STRING,
      defaultValue: 'https://i.epochtimes.com/assets/uploads/2021/08/id13156667-shutterstock_376153318-450x322.jpg'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn( 'Users', 'image' );
  }
};