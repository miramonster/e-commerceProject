'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Review.belongsTo(models.User, {as: 'reviewer', foreignKey:'user_id'})
      models.Review.belongsTo(models.Product, {as: 'product', foreignKey:'product_id'})
    }
  }
  Review.init({
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};