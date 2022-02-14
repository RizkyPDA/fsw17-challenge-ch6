require("dotenv").config();
const express = require("express"); // Import modul Express.js
const app = express();
const cookieParser = require("cookie-parser");
const sequelize = require("./utils/databaseConnection");
const routes = require("./routes/router");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

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
  .sync()
  .then(() => {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
