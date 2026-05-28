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
 static async validLogin(req, res) {
    try {
      const { email, password } = req.body;
      let user = await User.findOne({
        where: { email },
      });
      if (user) {
        const isValidPW = bcrypt.compareSync(password, user.password);
        if (isValidPW) {
          req.session.userId = user.id;
          req.session.role = user.role;
          if (user.role === "seller") {
            return res.redirect(`/seller/${user.id}`);
          } else if (user.role === "buyer") {
            return res.redirect(`/buyer/${user.id}`);
          }
        } else {
          const error = `Invalid Password`;
          return res.redirect(`/logIn?error=${error}`);
        }
      } else {
        const error = `Invalid Email`;
        return res.redirect(`/logIn?error=${error}`);
      }
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = UserController