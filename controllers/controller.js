const { Cart, Product, Profile, User } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

class Controller {
  static async baseBuyer(req, res) {
    try {
      res.render("baseBuyer");
    } catch (error) {
      res.send(error);
    }
  }
  static async baseSeller(req, res) {
    try {
      res.render("baseSeller");
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;
