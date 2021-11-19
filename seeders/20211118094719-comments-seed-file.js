'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: 20 }).map((element, index) => ({
        id: index * 10 + 1,
        text: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias minus illum dolor quas rerum. Iusto, reiciendis mollitia exercitationem labore at qui sed voluptatem facere incidunt. Nostrum itaque sequi unde laudantium.`,
        UserId: Math.floor(Math.random() * 3) * 10 + 1,
        RestaurantId: Math.floor(Math.random() * 5) * 10 + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {});
  },
};
