const { Cart, Product, Profile, User } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const { formatRupiah } = require('../halpers/formatRupiah');

class Controller {

  static async welcome(req, res) {
    try {

      res.render("welcome");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
  static async baseBuyer(req, res) {
    try {
    const { search } = req.query;
    
    let product = await Product.searchProducts(search);


      let user = await User.findAll({where: { role: 'buyer'}})
      res.render("baseBuyer", {product, user, buyerId: req.query.buyerId, formatRupiah, search});
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
          [Op.gt]: 0 
        }
      },
      include: [{ model: Product }],
      order: [['id', 'ASC']] 
    });

  
    const total = carts.reduce((sum, item) => {
      return sum + (item.quantity * item.Product.price);
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
        buyerId: id
      }
    });


    if (action === 'addcart') {
      if (!cart) {
     
        await Cart.create({
          productId,
          buyerId: id,
          quantity: 1
        });
      } else if (cart.quantity === 0) {
        
        cart.quantity = 1;
        await cart.save();
      }

    }

    else if (action === 'increment') {
      if (cart) {
        await cart.increment('quantity', { by: 1 });
      }
    } 

    else if (action === 'decrement') {
     
      if (cart && cart.quantity > 0) {
        await cart.decrement('quantity', { by: 1 });
      }
    } 

    else if (action === 'delete') {
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





  static async baseSeller(req, res) {
    try {
      res.render("baseSeller");
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;
