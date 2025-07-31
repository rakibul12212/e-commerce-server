const express = require("express");
const app = express();
const connectDb = require("./db/connect");
require("dotenv").config();

const port = process.env.PORT || 5000;
//  const cors = require("cors");

const products_routes = require("./routes/products");

// middleware
// app.use(cors());
app.use("/api/products", products_routes);

app.get("/", (req, res) => {
  res.send("E-Commerce server Is Running");
});
// app.get("/allProducts", (req, res) => {
//   res.send(productData);
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
const startServer = async () => {
  try {
    await connectDb()(); // Call the connectDB function to establish a connection
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

startServer();
