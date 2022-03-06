require("dotenv").config();
const express = require("express"); // Import modul Express.js
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const sequelize = require("./utils/databaseConnection");
const flash = require("connect-flash");

const routes = require("./routes");

app.use(flash());

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser("secret"));
app.use(session({ cookie: { maxAge: 60000 }, secret: "secretforsession", resave: true }));

app.use(routes);

// error handling
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    error: statusCode,
    message: error.message,
  });
});

// connection
sequelize
  .sync({
    //force: true,
  })
  .then(() => {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
