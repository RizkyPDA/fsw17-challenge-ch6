const express = require("express");
const router = express.Router();
const fs = require("fs");
const isLoggedIn = require("../Middleware/Authmiddleware");
const { User_game, User_game_history, User_game_biodata } = require("../models");
const jwt = require("jsonwebtoken");
const { Users } = require("../models/user_game");
const controllerUser = require("../controllers/Users");

router.get("/", isLoggedIn, controllerUser.getUsers);

router.get("/main", isLoggedIn, (req, res) => {
  res.render("main.ejs", { headTitle: "Home" });
});

router.get("/game", isLoggedIn, (req, res) => {
  res.render("game.ejs", { headTitle: "Game" });
});

router.get("/login", (req, res) => {
  res.render("login.ejs", { headTitle: "Login" });
});

// router.get("/login", (req, res) => {
//   const { status } = req.query;
//   res.render("login", {
//     status,
//   });
// });

router.get("/register", (req, res) => {
  res.render("register", { headTitle: "Register Here!" });
});

router.post("/register", (req, res) => {
  const { nama, email, password } = req.body;
  console.log(req.body);
  const data = fs.readFileSync("./data/user.json", "utf-8");
  const dataParsed = JSON.parse(data);
  console.log(dataParsed.length);

  if (dataParsed.length == 0) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = {
      id: uuid(),
      nama,
      email,
      password: password,
    };
    dataParsed.push(newUser);
    fs.writeFileSync("./data/user.json", JSON.stringify(dataParsed, null, 4));
    res.redirect("/");
  } else {
    dataParsed.filter((item) => {
      console.log("item", item.email);
      if (item.email == email) {
        res.send({ message: "email already exist" });
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = {
          id: uuid(),
          nama,
          email,
          password: password,
        };
        dataParsed.push(newUser);
        fs.writeFileSync("./data/user.json", JSON.stringify(dataParsed, null, 4));
        res.redirect("/");
      }
    });
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const data = JSON.parse(fs.readFileSync("./data/user.json", "utf-8"));
  const userMatch = data.find((item) => item.email == email);

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

      res.redirect("/main");
    } else {
      res.redirect("/login?status=wrongpassword");
    }
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
