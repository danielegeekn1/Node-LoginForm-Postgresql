const express = require("express");
const app = express();
const { pool } = require("./dbConfig");
const port = process.env.PORT || 4000;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false })); //allows us to send data from frontend to our server
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/users/register", (req, res) => {
  res.render("register");
});
app.get("/users/login", (req, res) => {
  res.render("login");
});
app.get("/users/dashboard", (req, res) => {
  res.render("dashboard", { user: "Conor" });
});
app.post("/users/register", (req, res) => {
  let { email, name, password, password2 } = req.body;
  console.log({ email, name, password, password2 });
  let errors = [];
  //check wether all field of our form are filled
  if (!name || !email || !password || !password2) {
    errors.push({ message: "please enter all fields" });
  }
  //check wether the password is at least of 6 characters
  if (password.lenght < 6) {
    errors.push({ message: "password should be at least 6 characters" });
  }
  //check wether the passwords match correctly
  if (password !== password2) {
    errors.push({ message: "password must match" });
  }
  if (errors.lenght > 0) {
    res.render("register", { errors });
  }
});
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
