const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // res.locals.id = null;
        // res.locals.user = null;
        // res.locals.role_id = null;
        req.flash("error", "Token is Expired");
        res.redirect("/login?status=tokenexpired");
      } else {
        console.log("decoded", decodedToken);
        //res.locals; buat variable jadi global
        // res.locals.id = decodedToken.id;
        // res.locals.user = decodedToken.username;
        // res.locals.role_id = decodedToken.role_id;
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.locals.id = null;
    res.locals.user = null;
    req.flash("error", "You're not Login, Please Login");
    res.redirect("/login");
  }
};

const isLoggedInAsAdmin = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        req.flash("error", "Token is Expired");
        res.redirect("/login");
      } else {
        if (decodedToken.role_id !== "SuperAdmin") {
          req.flash("error", "You're Not Login As Admin");
          res.redirect("/");
        } else {
          res.locals.user = decodedToken.username;
          next();
        }
      }
    });
  } else {
    res.locals.user = null;
    req.flash("error", "You're not Login, Please Login");
    res.redirect("/login");
  }
};

module.exports = { isLoggedIn, isLoggedInAsAdmin };
