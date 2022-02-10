'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('SellerReviews', 'seller_id', {
      type: Sequelize.INTEGER

    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('SellerReviews', 'seller_id')
  }
};
