"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.User, { foreignKey: "sellerId" });
      Product.hasMany(models.Cart, { foreignKey: "productId" });
    }

    static async searchProducts(searchKeyword) {
      let whereCondition = {};

      if (searchKeyword) {
        whereCondition.name = {
          [Op.iLike]: `%${searchKeyword}%` 
        };
      }

      return await Product.findAll({
        where: whereCondition,
        order: [['name', 'ASC']]
      });
    } 
    async reduceStock(quantity) {
      this.stock = this.stock - quantity;
      await this.save();
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      sellerId: DataTypes.INTEGER,
      imageUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    },
  );
  return Product;
};
