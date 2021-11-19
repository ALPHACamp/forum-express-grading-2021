'use strict'
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ raw: true, nest: true })
    const restaurants = await Restaurant.findAll({ raw: true, nest: true })
    let userArray = []
    let restArray = []
    for (let user of users) {
      userArray.push(user.id)
    }
    for (let rest in restaurants) {
      restArray.push(rest.id)
    }
    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: 20 }).map((d, i) => ({
        text: faker.lorem.text().substring(0, 30),
        UserId: userArray[Math.floor(Math.random() * userArray.length)],
        RestaurantId: restArray[Math.floor(Math.random() * restArray.length)],
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
