const Controller = require("../controllers/controller");
const router = require("express").Router();

router.use(function (req, res, next) {
  if (!req.session.userId) {
    const error = `Please Login First!`;
    res.redirect(`/logIn?error=${error}`);
  } else {
    next();
  }
});

router.use(function (req, res, next) {
  if (req.session.userId && req.session.role !== `buyer`) {
    const error = `You haven't access!!`;
    res.redirect(`/logIn?error=${error}`);
  } else if (req.session.userId && req.session.role === `buyer`) {
    next();
  }
});

router.get("/:id", Controller.baseBuyer);
router.get("/cart/:id", Controller.showCart);
router.post("/cart/:id", Controller.postCart);
router.post("/checkout", Controller.checkout);

module.exports = router;