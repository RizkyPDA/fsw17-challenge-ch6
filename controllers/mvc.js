const Home = (req, res, next) => {
  res.render("main.ejs", { headTitle: "Home" });
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

module.exports = {
  Home,
  Login,
  Register,
  Game,
};
