'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('Products', 'avg_rating', {
      type: Sequelize.INTEGER

    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Products', 'avg_rating')
  }
};
