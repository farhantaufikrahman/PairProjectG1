const Controller = require("../controllers/controller");
const router = require("express").Router();

router.get("/", Controller.baseBuyer);

module.exports = router;
