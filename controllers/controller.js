const { Cart, Product, Profile, User } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { formatRupiah } = require("../helpers/formatRupiah");

class Controller {
  static async welcome(req, res) {
    try {
      res.render("welcome");
    } catch (error) {
      res.send(error);
    }
  }
  static async showProfile(req, res) {
    try {
      let data = await User.findByPk(req.session.userId, {
        include: Profile,
      });

      res.render("profile", { data });
    } catch (error) {
      res.send(error);
    }
  }
  //=============================Buyer Page===============================
  static async baseBuyer(req, res) {
    try {
      let product = await Product.findAll({
        order: [["id", "ASC"]],
      });
      const { search } = req.query;
      if (search) {
        product = await Product.searchProducts(search);
      }
      let user = await User.findAll({ where: { role: "buyer" } });
      res.render("baseBuyer", {
        product,
        user,
        buyerId: req.session.userId,
        formatRupiah,
        search,
      });
    } catch (error) {
      res.send(error);
    }
  }
  static async showCart(req, res) {
    try {
      const { id } = req.params;
      const carts = await Cart.findAll({
        where: {
          buyerId: id,
          quantity: {
            [Op.gt]: 0,
          },
        },
        include: [{ model: Product }],
        order: [["id", "ASC"]],
      });

      const total = carts.reduce((sum, item) => {
        return sum + item.quantity * item.Product.price;
      }, 0);

      res.render("carts", { carts, total, buyerId: id, formatRupiah });
    } catch (error) {
      res.send(error);
    }
  }
  static async postCart(req, res) {
    try {
      const { id } = req.params;
      const { productId, action } = req.body;

      const cart = await Cart.findOne({
        where: {
          productId,
          buyerId: id,
        },
      });

      if (action === "addcart") {
        if (!cart) {
          await Cart.create({
            productId,
            buyerId: id,
            quantity: 1,
          });
        } else if (cart.quantity === 0) {
          cart.quantity = 1;
          await cart.save();
        }
      } else if (action === "increment") {
        if (cart) {
          await cart.increment("quantity", { by: 1 });
        }
      } else if (action === "decrement") {
        if (cart && cart.quantity > 0) {
          await cart.decrement("quantity", { by: 1 });
        }
      } else if (action === "delete") {
        if (cart) {
          cart.quantity = 0;
          await cart.save();
        }
      }

      res.redirect(`/buyer/cart/${id}`);
    } catch (error) {
      res.send(error);
    }
  }

  static async checkout(req, res) {
    try {
      const buyerId = req.session.userId;

      const carts = await Cart.findAll({
        where: { buyerId, quantity: { [Op.gt]: 0 } },
        include: [{ model: Product }],
      });

      if (carts.length === 0) return res.redirect(`/buyer/cart/${buyerId}`);

      for (const item of carts) {
        await Product.decrement("stock", {
          by: item.quantity,
          where: { id: item.productId },
        });

        await item.destroy();
      }

      res.redirect(`/buyer/${buyerId}`);
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }

  //====================Seller Page=====================================
  static async baseSeller(req, res) {
    try {
      let data = await Product.findAll();
      res.render("baseSeller", { data, usId: req.session.userId });
    } catch (error) {
      res.send(error);
    }
  }

  static async getProduct(req, res) {
    try {
      res.render(`formAddProduct`, { usId: req.session.userId });
    } catch (error) {
      res.send(error);
    }
  }
  static async addProduct(req, res) {
    try {
      const { name, price, stock, imageUrl } = req.body;
      await Product.create({
        name,
        price,
        stock,
        imageUrl,
        sellerId: req.session.userId,
      });
      res.redirect(`/seller/${req.session.userId}`);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        error = error.errors.map((el) => {
          return el.message;
        });
      }
      res.send(error);
    }
  }
  static async delProduct(req, res) {
    try {
      const { id } = req.params;
      Product.findByPk(id)
        .then((product) => {
          if (!product) {
            throw new Error("Product not found");
          }
          return Product.destroy({
            where: { id },
          });
        })
        .then(() => {
          res.redirect(`/seller/${req.session.userId}`);
        });
    } catch (error) {
      res.send(error);
    }
  }
  static async formEdit(req, res) {
    try {
      const { id } = req.params;
      let data = await Product.findByPk(id);
      res.render(`formEditProduct`, {
        data,
        usId: req.session.userId,
      });
    } catch (error) {
      res.send(error);
    }
  }
  static async goEdit(req, res) {
    try {
      const { id } = req.params;
      const { name, price, stock, imageUrl } = req.body;
      await Product.update(
        {
          name,
          price,
          stock,
          imageUrl,
        },
        { where: { id } },
      );
      res.redirect(`/seller/${req.session.userId}`);
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;
