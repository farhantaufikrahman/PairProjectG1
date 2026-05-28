"use strict";
const { Model } = require("sequelize");
const { Op } = require("sequelize");
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
          [Op.iLike]: `%${searchKeyword}%`,
        };
      }

      return await Product.findAll({
        where: whereCondition,
        order: [["name", "ASC"]],
      });
    }
    async reduceStock(quantity) {
      this.stock = this.stock - quantity;
      await this.save();
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name Required!!",
          },
          notEmpty: {
            msg: "Name Required!!",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Price Required!!",
          },
          notEmpty: {
            msg: "Price Required!!",
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Stock Required!!",
          },
          notEmpty: {
            msg: "Stock Required!!",
          },
        },
      },
      sellerId: DataTypes.INTEGER,
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Image Required!!",
          },
          notEmpty: {
            msg: "Image Required!!",
          },
          isUrl: {
            msg: "URL Format Required!!",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
    },
  );
  return Product;
};
