'use strict';
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({attribute: ['id']})
    const restaurants = await Restaurant.findAll({attribute: ['id']})
    const userId = []
    const restaurantId = []

    // 將目前資料庫內有的userId & restaurantId 存成陣列
    for (let user of users) {
      userId.push(user.id)
    }
    for (let restaurant of restaurants) {
      restaurantId.push(restaurant.id)
    }

    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 10 }).map((d, i) =>
      ({
        text: faker.lorem.text().substring(0, 20),
        UserId: userId[Math.floor(Math.random() * userId.length)],
        RestaurantId: restaurantId[Math.floor(Math.random() * restaurantId.length)],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      ), {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};