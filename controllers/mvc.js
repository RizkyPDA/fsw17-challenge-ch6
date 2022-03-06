const { Users, UserGameHistory, UserGameBiodata } = require("../models/index");

const Home = (req, res, next) => {
  console.log("user", req.user);
  const { name, user_id } = req.user;
  res.render("main.ejs", { headTitle: "Home", name, user_id });
};

const Login = (req, res, next) => {
  const { error } = req.flash();
  res.render("login.ejs", {
    headTitle: "Login",
    error: error,
  });
};

const Register = (req, res, next) => {
  try {
    const { status } = req.query;
    res.render("register.ejs", { headTitle: "Register", status });
  } catch (error) {
    next(error);
  }
};

const Game = (req, res) => {
  console.log("req", req.user);

  const { name, user_id } = req.user;

  res.render("game.ejs", { headTitle: "Game", name, user_id });
};

const Dashboard = async (req, res, next) => {
  try {
    const { name, user_id } = req.user;

    const users = await Users.findAll({
      include: ["user_game_history", "user_game_biodata"],
    });
    //console.log("users", users);
    res.render("dashboard.ejs", {
      headTitle: "Dashboard",
      name,
      user_id,
      loginMessage: "Login Success",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const DashboardStatistic = async (req, res, next) => {
  try {
    const { name, user_id } = req.user;
    console.log("param", req.params.id);

    const userHistory = await UserGameHistory.findOne({
      include: ["user_game"],
      where: { user_game_id: req.params.id },
    });

    console.log("userHistory", userHistory);

    res.render("dashboard-statistic.ejs", {
      headTitle: "Dashboard",
      name,
      user_id,
      loginMessage: "Login Success",
      data: userHistory,
    });
  } catch (error) {
    next(error);
  }
};

const DeleteUserHistory = async (req, res) => {
  try {
    console.log("delete", req.params.id);

    const UserToDelete = await Users.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    await UserToDelete.destroy();

    if (UserToDelete) {
      res.redirect("/dashboard/");
    }
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.redirect("/dashboard/");
  }
};

const editUser = async (req, res, next) => {
  try {
    const { name } = req.user;
    console.log("reqbody", req.body);
    const editUser = await Users.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    res.render("editUser.ejs", {
      headTitle: "EDIT USER",
      data: editUser,
      name,
    });
  } catch (eror) {
    next();
  }
};
const editUserData = async (req, res, next) => {
  try {
    console.log("reqbody", req.body);
    await Users.update(req.body, {
      where: {
        uuid: req.params.id,
      },
    });
  } catch (eror) {
    next();
  }
};

module.exports = {
  Home,
  Login,
  Register,
  Game,
  Dashboard,
  DashboardStatistic,
  DeleteUserHistory,
  editUser,
  editUserData,
};
