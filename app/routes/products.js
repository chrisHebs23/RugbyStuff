const Router = require("express-promise-router");
const { pool } = require("../db");

const router = new Router();

module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products");
    res.status(200).send(rows);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (rows.length > 0) {
      res.status(200).send(rows);
    }
    res.status(404).send("Product does not exist");
  } catch (err) {
    next(err);
  }
});
