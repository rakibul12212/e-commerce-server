const express = require("express");
const app = express();
const connectDb = require("./db/connect");
require("dotenv").config();

const port = process.env.PORT || 5000;


const products_routes = require("./routes/products");

app.use("/api/products", products_routes);

app.get("/", (req, res) => {
  res.send("E-Commerce server Is Running");
});

const startServer = async () => {
  try {
    await connectDb(process.env.MONGO_URL); 
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1); 
  }
};

startServer();
