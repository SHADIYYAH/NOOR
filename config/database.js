

// require("dotenv").config();
// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.DB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Connected to MongoDB.");
//   } catch (error) {
//     console.error("Database connection error:", error);
//     process.exit(1); // Exit process with failure
//   }
// };

// module.exports = connectDB;

require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;

