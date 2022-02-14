const express = require("express");
const router = express.Router();
const fs = require("fs");
const isLoggedIn = require("../Middleware/Authmiddleware");
const { User_game, User_game_history, User_game_biodata } = require("../models");
const jwt = require("jsonwebtoken");
const { Users } = require("../models/user_game");
const controllerUser = require("../controllers/Users");

// router.get("/", isLoggedIn, controllerUser.getUsers);

router.get("/", (req, res, next) => {
  try {
    const { status } = req.query;
    res.render("main.ejs", { headTitle: "Home", status });
  } catch (error) {
    next(error);
  }
});

// router.get("/main", isLoggedIn, (req, res) => {
//   res.render("main.ejs", { headTitle: "Home" });
// });

// router.get("/game", isLoggedIn, (req, res) => {
//   res.render("game.ejs", { headTitle: "Game" });
// });

router.get("/login", (req, res, next) => {
  try {
    const { status } = req.query;
    res.render("login.ejs", { headTitle: "Login", status });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  const userAccount = await User_game.findAll();
  const userMatch = userAccount.find((item) => item.email === email);

  if (!userMatch) {
    res.redirect("/login?status=emailnotfound");
  } else {
    if (password === userMatch.password) {
      console.log("login user", req.body);
      const token = jwt.sign(
        {
          email: userMatch.email,
          id: userMatch.id,
        },
        "secret",
        {
          expiresIn: 60 * 60 * 24,
        }
      );
      console.log("token generated", token);
      res.cookie("jwt", token, { maxAge: 1000 * 60 * 60 * 24 });
      //   jwt.verify(token, "secret", (err, decodedToken) => {
      //     console.log(decodedToken);
      //   });

      res.redirect("/dashboard");
    } else {
      res.redirect("/login?status=wrongpassword");
    }
  }
});

router.get("/register", (req, res, next) => {
  try {
    res.render("register.ejs", { headTitle: "Register" });
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  const { username, email, password, age, address, city, win, lose } = req.body;

  try {
    const newUser = await User_game.create({
      username,
      email,
      password,
    });

    await User_game_biodata.create({
      age,
      address,
      city,
      user_uuid: newUser.uuid,
    });

    await User_game_history.create({
      win,
      lose,
      user_uuid: newUser.uuid,
    });

    if (newUser) {
      res.redirect(`/dashboard/${newUser.uuid}`);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/get-cookies", (req, res) => {
  console.log(req.cookies);
  res.json({ cookies: req.cookies });
});

router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
});

module.exports = router;
