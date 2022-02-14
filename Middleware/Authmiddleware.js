const jwt = require("jsonwebtoken");
const isLoggedIn = (req, res, next) => {
  // const token = req.cookies.jwt;
  // console.log("token", req.cookies);
  // if (token) {
  //   jwt.verify(token, "secret", (err, decodedToken) => {
  //     if (err) {
  //       res.locals.user = null;
  //       res.redirect("../views/login.ejs");
  //     } else {
  //       res.locals.user = decodedToken.email;
  //       console.log(decodedToken);
  //       next();
  //     }
  //   });
  // } else {
  //   res.locals.user = null;
  //   res.redirect("../views/login.ejs");
  // }
  const isCookies = req.cookies;
  console.log("cookies", isCookies);
  if (isCookies == undefined) {
    res.locals.user = null;
    res.redirect("/login");
  } else {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, "secret", (err, decoded) => {
        if (err) {
          console.log("err", err);
          res.locals.user = null;
          res.redirect("login");
        } else {
          res.locals.user = decoded.email;
          console.log("user", res.locals.user);
          //res.redirect("main");
          next();
        }
      });
    }
    next();
  }
};

module.exports = isLoggedIn;
