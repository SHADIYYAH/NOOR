require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const displayRoutes = require("express-routemap");
const userRoute = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 3000;

// Choose the appropriate DB_URI based on the environment (development or production)
const DB_URI =
  process.env.NODE_ENV === "production"
    ? process.env.DB_URI_PRODUCTION
    : process.env.DB_URI;

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Routes setup
app.use("/api/v1/user", userRoute);

// Mongoose connection and server start
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
  
  })
  .then(() => {
    console.log("Connection to MongoDB has been established successfully 🙌.");

    // Start the server after the database connection is successful
    app.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
      displayRoutes(app);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
