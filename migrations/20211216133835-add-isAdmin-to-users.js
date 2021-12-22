'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'isAdmin', {
      type: Sequelize.BOOLEAN,
      // 寫入 MySQL 時會用 0 表示 false，不過實際在 app 裡呼叫 isAdmin 時會回傳 false，同時 True 寫入會變成 1。
      defaultValue: false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'isAdmin')
  }
};
