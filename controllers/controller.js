const { Cart, Product, Profile, User } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const PDFDocument = require("pdfkit");
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
        where: {
          buyerId,
          quantity: {
            [Op.gt]: 0,
          },
        },
        include: [{ model: Product }],
      });

      if (carts.length === 0) {
        return res.redirect(`/buyer/cart/${buyerId}`);
      }

      const total = carts.reduce((sum, item) => {
        return sum + item.quantity * item.Product.price;
      }, 0);

      for (const item of carts) {
        await Product.decrement("stock", {
          by: item.quantity,
          where: {
            id: item.productId,
          },
        });
        await item.destroy();
      }
      const PDFDocument = require("pdfkit");
      const doc = new PDFDocument({
        margin: 50,
      });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice-${buyerId}.pdf`,
      );
      doc.pipe(res);
      doc.fontSize(20).font("Helvetica-Bold").text("INVOICE", {
        align: "center",
      });
      doc.moveDown();
      doc.fontSize(12).font("Helvetica").text(`Buyer ID : ${buyerId}`);
      doc.text(`Tanggal : ${new Date().toLocaleDateString("id-ID")}`);
      doc.moveDown();
      doc.font("Helvetica-Bold");
      doc.text("Produk", 50, doc.y);
      doc.text("Qty", 300, doc.y - doc.currentLineHeight());
      doc.text("Subtotal", 400, doc.y - doc.currentLineHeight());
      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);
      carts.forEach((item) => {
        const subtotal = item.quantity * item.Product.price;
        const y = doc.y;
        doc.font("Helvetica");
        doc.text(item.Product.name, 50, y);
        doc.text(String(item.quantity), 300, y);
        doc.text(`Rp ${subtotal.toLocaleString("id-ID")}`, 400, y);
        doc.moveDown(0.5);
      });
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);
      doc
        .font("Helvetica-Bold")
        .text(`Total: Rp ${total.toLocaleString("id-ID")}`, {
          align: "right",
        });
      doc.end();
    } catch (error) {
      console.log(error);
      res.send(error.message);
    }
  }
  static async baseSeller(req, res) {
    try {
      let data = await Product.findAll();
      res.render("baseSeller", {
        data,
        usId: req.session.userId,
        formatRupiah,
      });
    } catch (error) {
      res.send(error);
    }
  }
  static async getProduct(req, res) {
    try {
      const { errors } = req.query;
      res.render(`formAddProduct`, { usId: req.session.userId, errors });
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
        res.redirect(
          `/seller/${req.session.userId}/addProduct?errors=${error}`,
        );
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
      const { errors } = req.query;
      let data = await Product.findByPk(id);
      res.render(`formEditProduct`, {
        data,
        usId: req.session.userId,
        errors,
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
      if (error.name === "SequelizeValidationError") {
        error = error.errors.map((el) => {
          return el.message;
        });
        res.redirect(`/seller/${req.session.userId}?errors=${error}`);
      }
      res.send(error);
    }
  }
}

module.exports = Controller;
