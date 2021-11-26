'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'isAdim')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'isAdim', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    })
  }
}
