// require("dotenv").config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const PORT = process.env.PORT;
// const DB_URI = process.env.DB_URI;
// const displayRoutes = require("express-routemap");
// const userRoute = require("./routes/user");

// const db = require("./config/database");
// const app = express();
// app.use(bodyParser.json());
// app.use(cors());

// app.use("/api/v1/user", userRoute);

// mongoose
//   .connect(`${DB_URI}`)
//   .then(() => {
//     console.log("Connection has been established successfully🙌.");
//     app.listen(PORT, async () => {
//       console.log(`... listening on ${PORT}`);
//       await db.connect().then((res) => console.log("I am here "));
//       displayRoutes(app);
//     });
//   })
//   .catch((err) => console.log("Error: " + err));

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const displayRoutes = require("express-routemap");
const userRoute = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Routes setup
app.use("/api/v1/user", userRoute);

// Mongoose connection and server start
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection to MongoDB has been established successfully 🙌.");

    // Start the server after the database connection is successful
    app.listen(PORT, () => {
      console.log(`Server is listening on port http://localhost:${PORT}`);
      displayRoutes(app);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
