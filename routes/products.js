const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getAllProductsTesting,
} = require("../controllers/products");

// Routes
router.get("/", getAllProducts);
router.get("/testing", getAllProductsTesting);

module.exports = router;
