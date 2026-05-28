const express = require("express");
const session = require("express-session");
const router = require("./routers");
const app = express();
const port = 3005;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "himitsu",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: true },
  }),
);

app.use(router);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
