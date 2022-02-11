'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addConstraint('SellerReviews', {
      fields: ['seller_id'],
      type: 'foreign key',
      name: 'seller_id',
      references: { //Required field
        table: 'Users',
        field: 'id'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeConstraint('SellerReviews', 'seller_id');
  }
};
