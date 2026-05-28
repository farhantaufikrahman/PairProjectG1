const router = require("express").Router();
const forBuyer = require("./buyer");
const forSeller = require("./seller");

router.use("/seller", forSeller);
router.use("/buyer", forBuyer);

module.exports = router;
