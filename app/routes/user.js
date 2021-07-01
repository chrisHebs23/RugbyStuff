const Router = require("express-promise-router");
const { pool } = require("../db");

const router = new Router();

module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    res.status(200).send(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    if (rows.length > 0) {
      res.status(200).send(rows);
    }
    res.status(404).send("User does not exist");
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const { rows } = await pool.query(
      "UPDATE users SET email = $1 WHERE id = $2 RETURNING *",
      [email, id]
    );
    if (rows.length > 0) {
      res.status(200).send(rows);
    }
    res.status(404).send("User does not exist");
  } catch (err) {
    next(err);
  }
});
