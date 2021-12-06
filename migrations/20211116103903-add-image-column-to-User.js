'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue:
        'https://64.media.tumblr.com/76c9276332a286cbb7efd5c3a6efd1d1/tumblr_nusxze8qie1rpwm80o1_r1_250.png'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'image')
  }
}
