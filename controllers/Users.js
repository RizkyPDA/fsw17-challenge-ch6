const { User_game } = require("../models");

exports.getUsers = async (req, res) => {
  console.log("user_game", typeof User_game);
  const users = await User_game.findAll();
  console.log("users", users);
  res.render("dashboard.ejs", { headTitle: "Home" });
};
