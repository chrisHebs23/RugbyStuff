const Router = require("express-promise-router");
const { pool } = require("../db");

const router = new Router();

module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM cart");

    res.status(200).send(rows);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { quantity, user_id, product_id } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO cart (quantity, user_id, product_id) VAlUES($1, $2, $3 ) RETURNING *",
      [quantity, user_id, product_id]
    );
    res.status(201).send(rows);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/checkout", async (req, res, next) => {
  try {
    const { user_id, product_id } = req.body;
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM cart WHERE id = $1", [id]);
    if (rows.length > 0) {
      const order = await pool.query(
        "INSERT INTO orders (user_id, product_id, cart_id) VAlUES($1, $2, $3) RETURNING *",
        [user_id, product_id, id]
      );
      res.status(201).send(order);
    } else {
      res.status(404).send("Nothing in cart");
    }
  } catch (err) {
    next(err);
  }
});

router.get("/:id/checkout", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM orders WHERE cart_id = $1",
      [id]
    );
    res.status(200).send(rows);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "delete from cart where id = $1 RETURNING *",
      [id]
    );

    res.status(204).send("deleted");
  } catch (err) {
    next(err);
  }
});
