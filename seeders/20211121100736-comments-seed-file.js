'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      ['Good', 'Yummy', 'Delicious', 'Soso', 'Terrible', 'Bad', 'Worst']
        .map((item, index) =>
        ({
          id: index * 10 + 1,
          text: item,
          UserId: Math.floor(Math.random() * 2) + 1,
          RestaurantId: Math.floor(Math.random() * 30)  + 53,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
