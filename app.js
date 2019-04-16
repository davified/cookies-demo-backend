const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const app = express();
const FRONTEND_URL = ["http://localhost:3000", "http://xyz:3000"];

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true

  // the following options doesn't fix the problem
  // optionsSuccessStatus: 200, // default behaviour: OPTIONS /secret 204 0.096 ms - 0
  // origin: function(origin, callback) {
  //   if (FRONTEND_URL.includes(origin)) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not allowed by CORS"));
  //   }
  // }
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json("hello world");
});

app.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    res
      .cookie("token", "some_secret_jwt", {
        httpOnly: true
      })
      .json("login success. sending cookies your way");
  } else {
    next();
  }
});

app.post("/secret", (req, res, next) => {
  console.log(`token: ${req.cookies.token}`);
  if (req.cookies.token === "some_secret_jwt") {
    res.json("received token in cookies. here's your secret.");
  } else {
    res.json("invalid cookie. access denied.");
  }
});

module.exports = app;
