const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  seedProducts,
  getCategories,
  getBrands,
  getSubCategories,
  getProductsByCategory,
  getFeaturedProducts,
  getProductStats,
} = require("../controllers/products");

// Main routes
router.get("/allProducts", getAllProducts); // Returns ALL products matching filters (no pagination)
router.get("/categories", getCategories);
router.get("/brands", getBrands);
router.get("/featured", getFeaturedProducts);
router.get("/stats", getProductStats);
router.post("/createProduct", createProduct);
router.post("/seed", seedProducts);

// Category routes
router.get("/categories/:category/subcategories", getSubCategories);
router.get("/categories/:category", getProductsByCategory);

// Product-specific routes (must come last)
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
