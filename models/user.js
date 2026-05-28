"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Email Required!!",
          },
          notEmpty: {
            msg: "Email Required!!",
          },
          isEmail: {
            msg: "Email Format Required!!",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password Required!",
          },
          notEmpty: {
            msg: "Password Required!",
          },
          len: {
            args: [6, 100],
            msg: "Password Min 6 Characters!",
          },
          is: {
            args: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
            msg: "Password Must Contains Uppercase, Number, and Unique Character!",
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Role Required!!",
          },
          notEmpty: {
            msg: "Role Required!!",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: (user, option) => {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(user.password, salt);
          user.password = hash;
        },
      },
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
