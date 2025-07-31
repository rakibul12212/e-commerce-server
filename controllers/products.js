const Product = require("../models/product");
const products = require("../data/products-data");

// Get all products with filtering, sorting, and pagination
const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      subCategory,
      hasDiscount,
      isNewArrival,
      flashSale,
      minPrice,
      maxPrice,
      search,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) filter.category = category.toLowerCase();
    if (subCategory) filter.subCategory = subCategory.toLowerCase();
    if (hasDiscount) filter.hasDiscount = hasDiscount === "true";
    if (isNewArrival) filter.isNewArrival = isNewArrival === "true";
    if (flashSale) filter.flashSale = flashSale === "true";

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { longDescription: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { subCategory: { $regex: search, $options: "i" } },
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === "desc" ? -1 : 1;

    // Execute query
    const allProducts = await Product.find(filter).sort(sortOptions);

    // Get total count
    const totalProducts = allProducts.length;

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: allProducts,
      totalProducts,
      filters: {
        category,
        subCategory,
        hasDiscount,
        isNewArrival,
        flashSale,
        minPrice,
        maxPrice,
        search,
        sort,
        order,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Testing endpoint
const getAllProductsTesting = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "All testing products fetched successfully",
  });
};

// Create a single product
const createProduct = async (req, res) => {
  try {
    const productData = {
      name: req.body.name,
      price: parseFloat(req.body.price) || 0,
      shortDescription: req.body.shortDescription,
      longDescription: req.body.longDescription,
      category: req.body.category,
      subCategory: req.body.subCategory,
      materials: req.body.materials,
      hasDiscount: req.body.hasDiscount,
      isNewArrival: req.body.isNewArrival,
      flashSale: req.body.flashSale,
      images: req.body.images,
      discount: parseFloat(req.body.discount) || 0,
      stockQuantity: req.body.stockQuantity,
      variants:
        req.body.variants?.filter(
          (variant) => variant.size && variant.color && variant.stock,
        ) || [],
    };

    const newProduct = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

// Seed database with sample data
const seedProducts = async (req, res) => {
  try {
    // Clear existing products
    await Product.deleteMany({});

    // Insert sample products from data file
    const seededProducts = await Product.insertMany(products);

    res.status(201).json({
      success: true,
      message: "Database seeded successfully",
      count: seededProducts.length,
      data: seededProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error seeding database",
      error: error.message,
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

// Get product categories
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

// Get subcategories by category
const getSubCategories = async (req, res) => {
  try {
    const { category } = req.params;
    const subCategories = await Product.distinct("subCategory", {
      category: category.toLowerCase(),
    });
    res.status(200).json({
      success: true,
      message: "Subcategories fetched successfully",
      data: subCategories,
      category: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching subcategories",
      error: error.message,
    });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({
      category: category.toLowerCase(),
    });

    res.status(200).json({
      success: true,
      message: `Products in ${category} category fetched successfully`,
      data: products,
      totalProducts: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products by category",
      error: error.message,
    });
  }
};

// Get featured products (new arrivals, flash sales, discounted)
const getFeaturedProducts = async (req, res) => {
  try {
    const newArrivals = await Product.find({ isNewArrival: true }).limit(6);
    const flashSales = await Product.find({ flashSale: true }).limit(6);
    const discounted = await Product.find({ hasDiscount: true }).limit(6);

    res.status(200).json({
      success: true,
      message: "Featured products fetched successfully",
      data: {
        newArrivals,
        flashSales,
        discounted,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching featured products",
      error: error.message,
    });
  }
};

// Get product statistics
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const categoriesCount = await Product.distinct("category").then(
      (categories) => categories.length,
    );
    const newArrivalsCount = await Product.countDocuments({
      isNewArrival: true,
    });
    const discountedCount = await Product.countDocuments({ hasDiscount: true });
    const flashSaleCount = await Product.countDocuments({ flashSale: true });

    res.status(200).json({
      success: true,
      message: "Product statistics fetched successfully",
      data: {
        totalProducts,
        categoriesCount,
        newArrivalsCount,
        discountedCount,
        flashSaleCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getAllProductsTesting,
  createProduct,
  seedProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategories,
  getSubCategories,
  getProductsByCategory,
  getFeaturedProducts,
  getProductStats,
};
