const Controller = require("../controllers/controller");
const UserController = require("../controllers/UserController");
const router = require("express").Router();

router.get("/", Controller.welcome);
router.get("/register", UserController.showRegister);
router.post("/register", UserController.register);
router.get("/logIn", UserController.logIn);
router.post("/logIn", UserController.validLogin);

module.exports = router;
