const Controller = require("../controllers/controller");
const router = require("express").Router();
const sequelize = require("sequelize");

router.use(function (req, res, next) {
  if (!req.session.userId) {
    const error = `Please Login First!`;
    res.redirect(`/logIn?error=${error}`);
  } else {
    next();
  }
});

router.use(function (req, res, next) {
  if (req.session.userId && req.session.role !== `seller`) {
    const error = `You haven't access!!`;
    res.redirect(`/logIn?error=${error}`);
  } else if (req.session.userId && req.session.role === `seller`) {
    next();
  }
});


router.get("/:usId", Controller.baseSeller);
router.get("/:usId/showProfile", Controller.showProfile);
router.get("/:usId/addProduct", Controller.getProduct);
router.post("/:usId/addProduct", Controller.addProduct);
router.get("/:usId/edtProduct/:id", Controller.formEdit);
router.post("/:usId/edtProduct/:id", Controller.goEdit);
router.get("/:usId/delProduct/:id", Controller.delProduct);

module.exports = router;