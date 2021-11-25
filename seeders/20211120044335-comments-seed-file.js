'use strict';
const faker = require('faker')

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
     await queryInterface.bulkInsert('Comments',
     Array.from({ length: 50 }).map((d, i) =>
       ({
          id: i + 1,
          text: faker.lorem.sentence(),
          UserId: Math.floor(Math.random() * 2) + 1, // 加上這行
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
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
