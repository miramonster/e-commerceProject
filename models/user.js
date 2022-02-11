'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(models.Product, {as: 'listings', foreignKey: 'user_id'})
      models.User.hasMany(models.SellerReview, {as: 'sellerreviews', foreignKey: 'seller_id'})
      models.User.hasMany(models.Message, {as: 'recievedmessages', foreignKey: 'seller_id'})
      models.User.hasMany(models.SavedItem, {as: 'wishlist', foreignKey: 'user_id'})
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};