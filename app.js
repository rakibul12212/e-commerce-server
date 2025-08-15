const express = require("express");
const products = require("./data/products"); 
const app = express();

app.use(express.json());

// Root route - plain text
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Get products
app.get("/products", (req, res) => {
  res.json(products);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
