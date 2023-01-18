const express = require("express");
const app = express();
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const port = process.env.PORT || 4000;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false })); //allows us to send data from frontend to our server
app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: process.env.SESSION_SECRET,
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false,
  })
);
app.use(flash());
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
app.post("/users/register", async (req, res) => {
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
  } else {
    //If form validation has passed
    let hashPsw = await bcrypt.hash(password, 10);
    console.log(hashPsw);
    pool.query(
      `SELECT * FROM users 
      WHERE email =$1 `,
      [email],
      (err, results) => {
        if (err) {
          throw err;
        }
        console.log(results.rows);
        if (results.rows.lenght > 0) {
          errors.push({ message: "User already registered" });
          res.render("register", { errors });
        } else {
          pool.query(
            `INSERT INTO users (name, email, password)
            VALUES($1, $2, $3)
            RETURNING id, password
            `,
            [name, email, hashPsw],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              req.flash("success_msg", "You are now registered, please login");
              res.redirect("/users/login");
            }
          );
        }
      }
    );
  }
});
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
