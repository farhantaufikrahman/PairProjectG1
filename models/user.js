"use strict";
const { Model } = require("sequelize");
// const { options } = require("../routers/buyer");
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, { foreignKey: "userId" });
      User.hasMany(models.Product, { foreignKey: "sellerId" });
      User.hasMany(models.Cart, { foreignKey: "buyerId" });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      hooks:{
        beforeCreate: (user, option) => {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(user.password, salt);

          user.password = hash
        }
      },
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
