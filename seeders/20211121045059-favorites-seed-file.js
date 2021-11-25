'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     await queryInterface.bulkInsert('Favorites',
     Array.from({ length: 20 }).map((d, i) =>
       ({
          id: i + 1,
          UserId: Math.floor(Math.random() * 3) + 1, // 加上這行
          RestaurantId: Math.floor(Math.random() * 50) + 1,
          createdAt: new Date(),
          updatedAt: new Date()
       })
     ), {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Favorites', null, {})
  }
};
