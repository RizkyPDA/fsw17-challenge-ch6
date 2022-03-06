const express = require("express");
const router = express.Router();
const fs = require("fs");
const { isLoggedIn, isLoggedInAsAdmin } = require("../Middleware/Authmiddleware");
const jwt = require("jsonwebtoken");

const controllerMCR = require("../controllers/mcr");
const controllerMVC = require("../controllers/mvc");

// MVC Routes
router.get("/", isLoggedIn, controllerMVC.Home);
router.get("/login", controllerMVC.Login);
router.get("/register", controllerMVC.Register);
router.get("/game", isLoggedIn, controllerMVC.Game);

router.get("/dashboard", isLoggedIn, controllerMVC.Dashboard);
router.get("/dashboard/statistic/:id", isLoggedIn, controllerMVC.DashboardStatistic);
router.get("/delete/:id", isLoggedIn, controllerMVC.DeleteUserHistory);
router.get("/edit/:id", isLoggedIn, controllerMVC.editUser);
router.post("/edit/:id", isLoggedIn, controllerMVC.editUserData);

// MVC Routes
router.post("/register", controllerMCR.Register);
router.post("/login", controllerMCR.Login);
router.post("/room/add", controllerMCR.CreateRoom);
router.post("/room/play", controllerMCR.PlayGameRoom);

// Backend
router.post("/api/register", controllerMCR.API_Register);

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
