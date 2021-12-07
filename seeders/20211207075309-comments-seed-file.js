'use strict';
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      //為什麼中間要傳入(d,i)這兩個參數
      Array.from({
        length: 20
      }), (d, i) => ({
        text: faker.lorem.text().substring(1, 15),
        UserId: Math.floor(Math.random() * 10) + 1,
        RestaurantId: Math.floor(Math.random() * 10) + 1,
        createAt: new Date(),
        updatedAt: new Date()

      })
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {});

  }
};