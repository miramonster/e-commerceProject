'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SellerReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.SellerReview.belongsTo(models.User, {as: 'sellerreviewer', foreignKey:'user_id'})
    }
  }
  SellerReview.init({
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SellerReview',
  });
  return SellerReview;
};