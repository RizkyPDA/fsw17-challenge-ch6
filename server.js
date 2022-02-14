require("dotenv").config();
const express = require("express"); // Import modul Express.js
const app = express();
const fs = require("fs"); // Import modul File System
const { uuid } = require("uuidv4");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const { status } = require("express/lib/response");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", require("./routes/router_user_game"));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

// app.get("/", isLoggedIn, (req, res) => {
//   res.render("main.ejs", { headTitle: "Home" });
// });

// app.get("/main", isLoggedIn, (req, res) => {
//   res.render("main.ejs", { headTitle: "Home" });
// });

// app.get("/game", isLoggedIn, (req, res) => {
//   res.render("game.ejs", { headTitle: "Game" });
// });

// app.get("/login", (req, res) => {
//   res.render("login.ejs", { headTitle: "Login" });
// });

// app.get("/register", (req, res) => {
//   res.render("register", { headTitle: "Register Here!" });
// });

// app.post("/register", (req, res) => {
//   const { nama, email, password } = req.body;
//   console.log(req.body);
//   const data = fs.readFileSync("./data/user.json", "utf-8");
//   const dataParsed = JSON.parse(data);
//   console.log(dataParsed.length);

//   if (dataParsed.length == 0) {
//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(password, salt);
//     const newUser = {
//       id: uuid(),
//       nama,
//       email,
//       password: password,
//     };
//     dataParsed.push(newUser);
//     fs.writeFileSync("./data/user.json", JSON.stringify(dataParsed, null, 4));
//     res.redirect("/");
//   } else {
//     dataParsed.filter((item) => {
//       console.log("item", item.email);
//       if (item.email == email) {
//         res.send({ message: "email already exist" });
//       } else {
//         const salt = bcrypt.genSaltSync(10);
//         const hashedPassword = bcrypt.hashSync(password, salt);
//         const newUser = {
//           id: uuid(),
//           nama,
//           email,
//           password: password,
//         };
//         dataParsed.push(newUser);
//         fs.writeFileSync("./data/user.json", JSON.stringify(dataParsed, null, 4));
//         res.redirect("/");
//       }
//     });
//   }
// });

// app.get("/login", (req, res) => {
//   const { status } = req.query;
//   res.render("login", {
//     status,
//   });
// });

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;
//   console.log(req.body);
//   const data = JSON.parse(fs.readFileSync("./data/user.json", "utf-8"));
//   const userMatch = data.find((item) => item.email == email);

//   if (!userMatch) {
//     res.redirect("/login?status=emailnotfound");
//   } else {
//     if (password === userMatch.password) {
//       const token = jwt.sign(
//         {
//           email: userMatch.email,
//           id: userMatch.id,
//         },
//         "secret",
//         {
//           expiresIn: 60 * 60 * 24,
//         }
//       );

//       res.cookie("jwt", token, { maxAge: 1000 * 60 * 60 * 24 });

//       // jwt.verify(token, "secret", (err, decodedToken) => {
//       //   console.log(decodedToken);
//       // });
//       res.redirect("/");
//     } else {
//       res.redirect("/login?status=wrongpassword");
//     }
//   }
// });

// app.get("/get-cookies", (req, res) => {
//   console.log(req.cookies);
//   res.json({ cookies: req.cookies });
// });

// app.get("/logout", (req, res) => {
//   res.cookie("jwt", "", { maxAge: 1 });
//   res.redirect("/login");
// });
