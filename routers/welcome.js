const Controller = require("../controllers/controller");
const UserController = require("../controllers/UserController")
const router = require("express").Router();

console.log("UserController:", UserController);
router.get("/", Controller.welcome);
router.get("/register", UserController.showRegister);
router.post("/register", UserController.register)

router.get("/logIn", UserController.logIn);
router.post("/logIn", UserController.validLogin)
router.post("/logIn", (req, res, next) => {
  console.log("POST logIn kena");
  console.log("body:", req.body);
  next();
}, UserController.validLogin);

module.exports = router; 
