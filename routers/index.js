const router = require("express").Router();
const forBuyer = require("./buyer");
const forSeller = require("./seller");
const welcome = require("./welcome");

router.use("/", welcome);
router.use("/seller", forSeller);
router.use("/buyer", forBuyer);

module.exports = router;
