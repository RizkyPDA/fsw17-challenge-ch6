const express = require("express");
const router = express.Router();
const fs = require("fs");
const { isLoggedIn } = require("../Middleware/Authmiddleware");
const { Users, User_game_history, User_game_biodata } = require("../models");
const jwt = require("jsonwebtoken");

const controllerMCR = require("../controllers/mcr");
const controllerMVC = require("../controllers/mvc");

// MVC Routes
router.get("/", controllerMVC.Home);
router.get("/login", controllerMVC.Login);
router.get("/register", controllerMVC.Register);
router.get("/game", isLoggedIn, controllerMVC.Game);

// MCR Routes
router.post("/api/register", controllerMCR.Register);
router.post("/api/login", controllerMCR.Login);
router.post("/api/room/add", controllerMCR.CreateRoom);
router.post("/api/room/play", controllerMCR.PlayGameRoom);

// router.get("/", isLoggedIn, controllerUser.getUsers);

// router.get("/main", isLoggedIn, (req, res) => {
//   res.render("main.ejs", { headTitle: "Home" });
// });

// router.get("/login", (req, res, next) => {
//   try {
//     const { status } = req.query;
//     res.render("login.ejs", { headTitle: "Login", status });
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/get-cookies", (req, res) => {
  console.log(req.cookies);
  res.json({ cookies: req.cookies });
});

router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
});

module.exports = router;
