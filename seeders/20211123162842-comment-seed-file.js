'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 30 }).map(d =>
      ({
        UserId: Math.floor(Math.random() * 4) * 10 + 1,
        RestaurantId: Math.floor(Math.random() * 50) * 10 + 1,
        text: faker.lorem.text().substring(0, 50),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}