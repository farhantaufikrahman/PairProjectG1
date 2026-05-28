const { User, Profile } = require("../models")
const path = require('path');
const bcrypt = require('bcryptjs');
class UserController{
    
      static async showRegister(req, res){
        try {
          let user = await User.findAll();
         
          let id = user.map(el =>{
            return el.id
          })
          res.render("register", {id})
        } catch (error) {
        
          res.send(error)
        }
      }
      static async register(req, res){
        try {
          const { email, password, fullName, phoneNumber, role, image, address } = req.body
    
          
          let data = await User.create({  email, password, role})
          
          await Profile.create({ fullName, phoneNumber, address, image, userId: data.id})
    
          res.redirect("/")
    
    
        } catch (error) {
  
          res.send(error)
        }
      }
static async logIn(req, res) {
    try {
      res.render("logIn");
    } catch (error) {
      res.send(error);
    }
  }
  static async validLogin(req, res, next) {
    try {
   
      const { email, password } = req.body;
      await User.findOne({
        where: { email },
      }).then((user) => {
        if (user) {
          console.log("user");
          const isValidPW = bcrypt.compareSync(password, user.password);
          if (isValidPW) {
              console.log("role:", user.role);
            if (user.role === 'buyer') {
                    return res.redirect(`/buyer?buyerId=${user.id}`);
                } else if (user.role === 'seller') {
                    return res.redirect('/seller');
                }
          }
        }
      });
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = UserController