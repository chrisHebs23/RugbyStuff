const passport = require("passport");
const Strategy = require("passport-local");
const pool = require("./app/db");
const bcrypt = require("bcrypt");

module.exports = function () {
  // Initialize passport
  passport.use(
    new Strategy((user_name, password, done) => {
      pool.query(
        "SELECT * FROM users WHERE user_name = $1",
        [user_name],
        (err, results) => {
          if (err) {
            return done(err);
          }

          if (results.rows.length > 0) {
            const user = results.rows[0];

            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) {
                return done(err);
              }
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false);
              }
            });
          } else {
            done(null, false);
          }
        }
      );

      return done(err);
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    pool.query(
      "SELECT id, username, type FROM users WHERE id = $1",
      [parseInt(id, 10)],
      (err, results) => {
        if (err) {
          console.error(
            "Error when selecting user on session deserialize",
            err
          );
          return done(err);
        }

        done(null, results.rows[0]);
      }
    );
  });
};
