var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json("hello world");
});

app.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    res
      .cookie("token", "some_secret_jwt", { httpOnly: true })
      .json("login success. sending cookies your way");
  } else {
    next();
  }
});

app.get("/protected", (req, res, next) => {
  if (req.cookies.token === "some_secret_jwt") {
    res.json("received token in cookies. here's your secret.");
  } else {
    res.json("invalid cookie. access denied.");
  }
});

module.exports = app;
