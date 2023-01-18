const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
app.set("view engine", "ejs");
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
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
