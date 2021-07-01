const express = require("express");
const { pool } = require("../db");
const bcrypt = require("bcrypt");

const router = express.Router();

module.exports = router;

router.post("/signup", async (req, res) => {
  let { user_name, email, password } = req.body;

  let errors = [];

  console.log({
    user_name,
    email,
    password,
  });

  if (!user_name || !email || !password) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  if (errors.length > 0) {
    res.send("register", { errors, user_name, email, password });
  } else {
    hashedPassword = await bcrypt.hash(password, 10);
    // Validation passed

    pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
      (err, results) => {
        if (err) {
          console.log(err);
        }

        if (results.rows.length > 0) {
          return res.status(404).send("Email already registered");
        } else {
          pool.query(
            `INSERT INTO users (user_name, email, password)
                VALUES ($1, $2, $3)
                RETURNING *`,
            [user_name, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }

              res.status(200).send("You are now registered. Please log in");
              // res.redirect("/login");
            }
          );
        }
      }
    );
  }
});

router.post(
  "/login",
  (req, res) => {
    let { user_name, password } = req.body;
    pool.query(
      "SELECT * FROM users WHERE  user_name = $1",
      [user_name],
      (err, result) => {
        if (err) {
          return err;
        }
        if (result.rows.length > 0) {
          const user = result.rows[0];

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              res.send(err);
            }
            if (isMatch) {
              res.send(user);
            } else {
              res.send("no user found");
            }
          });
        }
      }
    );
  }

  // passport.authenticate("local", {
  //   successRedirect: "/",
  //   failureRedirect: "/login",
  // })
);

router.get("/login", (req, res) => {
  res.send("hello");
});

router.get("/users", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM users");
  res.send(rows);
});
