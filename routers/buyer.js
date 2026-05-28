const Controller = require("../controllers/controller");
const router = require("express").Router();

router.get("/", Controller.baseBuyer);
router.get("/cart/:id", Controller.showCart)
router.post("/cart/:id", Controller.postCart);       

module.exports = router;
