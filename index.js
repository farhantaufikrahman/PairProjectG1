const express = require("express");
const app = express();
const port = 3005;
const router = require("./routers");
const Controller = require("./controllers/controller");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
