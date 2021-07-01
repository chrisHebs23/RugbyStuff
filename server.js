const express = require("express");
const bodyParser = require("body-parser");
const authRouters = require("./app/routes/auth");
const productRouters = require("./app/routes/products");
const userRouters = require("./app/routes/user");
const cartRouters = require("./app/routes/cart");
const orderRouters = require("./app/routes/orders");
const passport = require("passport");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = 3000;

// swagger definition
const swaggerDefinition = {
  info: {
    title: "Rugby Stuff API",
    version: "1.0.0",
    description: "Backend restfulAPI for an online Rugby Store",
  },
  host: "localhost:3000",
  basePath: "/",
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: [".app/routes/*.js"],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

app.use("/swagger.json", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const initializePassport = require("./passport-config");

initializePassport(passport);

app.use(express.urlencoded({ extended: false }));

const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/swagger.json", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/auth", authRouters);
app.use("/products", productRouters);
app.use("/users", userRouters);
app.use("/cart", cartRouters);
app.use("/orders", orderRouters);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
