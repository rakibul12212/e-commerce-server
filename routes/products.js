const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  seedProducts,
  getAllProductsTesting,
  getCategories,
  getSubCategories,
  getProductsByCategory,
  getFeaturedProducts,
  getProductStats,
} = require("../controllers/products");

// Special routes (must come before parameterized routes)
router.get("/allProducts", getAllProducts);
router.get("/testing", getAllProductsTesting);
router.get("/categories", getCategories);
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
