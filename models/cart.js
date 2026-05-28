"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.User, { foreignKey: "buyerId" });
      Cart.belongsTo(models.Product, { foreignKey: "productId" });
    }

    getCartSubtotal(){
      if (!this.Product) return 0; 
      return this.quantity * this.Product.price;

    }
  }
  Cart.init(
    {
      quantity: DataTypes.INTEGER,
      buyerId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cart",
    },
  );
  return Cart;
};
