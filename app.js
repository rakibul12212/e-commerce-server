const express = require("express");
const cors = require("cors");
const app = express();
const connectDb = require("./db/connect");
require("dotenv").config();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const products_routes = require("./routes/products");

app.use("/api/products", products_routes);

app.get("/", (req, res) => {
  res.send("E-Commerce server Is Running");
});

// Connect to database
const startServer = async () => {
  try {
    await connectDb(process.env.MONGO_URL); 
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to database:", error.message);
  }
};

// Initialize database connection
startServer();

// For Vercel deployment, export the app
module.exports = app;

// For local development
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
