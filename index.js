const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
 const cors = require("cors"); 
const productData = require("./data.js");


// middleware 
app.use(cors()); 


app.get("/", (req, res) => {
  res.send("E-Commerce server Is Running");
});
app.get("/allProducts", (req, res) => {
  res.send(productData);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
