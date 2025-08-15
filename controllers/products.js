const Product = require("../models/product");
const products = require("../data/products-data");

// Get all products with filtering and sorting (no pagination - returns all matching products)
const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      isDiscount,
      isLatest,
      isFlashSale,
      isFeature,
      isBestSeller,
      minPrice,
      maxPrice,
      search,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) filter.category = category.toLowerCase();
    if (brand) filter.brand = new RegExp(brand, "i");
    if (isDiscount) filter.isDiscount = isDiscount === "true";
    if (isLatest) filter.isLatest = isLatest === "true";
    if (isFlashSale) filter.isFlashSale = isFlashSale === "true";
    if (isFeature) filter.isFeature = isFeature === "true";
    if (isBestSeller) filter.isBestSeller = isBestSeller === "true";

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
        { shortDetails: { $regex: search, $options: "i" } },
        { longDetails: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === "desc" ? -1 : 1;

    // Execute query - returns ALL matching products (no pagination)
    const allProducts = await Product.find(filter).sort(sortOptions);

    res.status(200).json({
      success: true,
      message: `${allProducts.length} products fetched successfully`,
      data: allProducts,
      count: allProducts.length,
      appliedFilters: {
        category,
        brand,
        isDiscount,
        isLatest,
        isFlashSale,
        isFeature,
        isBestSeller,
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

// Create a single product
const createProduct = async (req, res) => {
  try {
    const productData = {
      id: req.body.id,
      name: req.body.name,
      price: parseFloat(req.body.price) || 0,
      discountPercent: parseFloat(req.body.discountPercent) || 0,
      primaryImg: req.body.primaryImg,
      detailsImg: req.body.detailsImg || [],
      shortDetails: req.body.shortDetails,
      longDetails: req.body.longDetails,
      specifications: req.body.specifications || {},
      category: req.body.category,
      categoryImg: req.body.categoryImg,
      isStock: req.body.isStock !== undefined ? req.body.isStock : true,
      isDiscount: req.body.isDiscount || false,
      PID: req.body.PID,
      SKU: req.body.SKU,
      brand: req.body.brand,
      model: req.body.model,
      warranty: req.body.warranty || "1 year",
      rating: parseFloat(req.body.rating) || 0,
      isWarranty:
        req.body.isWarranty !== undefined ? req.body.isWarranty : true,
      stockQuantity: parseInt(req.body.stockQuantity) || 0,
      isFeature: req.body.isFeature || false,
      isFlashSale: req.body.isFlashSale || false,
      isLatest: req.body.isLatest || false,
      deals: req.body.deals,
      isDeal: req.body.isDeal || false,
      reviewCount: parseInt(req.body.reviewCount) || 0,
      isBestSeller: req.body.isBestSeller || false,
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

    // Transform the nested data structure to flat products array with categoryImg
    const flatProducts = [];

    for (const categoryData of products) {
      for (const item of categoryData.items) {
        // Add categoryImg to each product item
        const productWithCategoryImg = {
          ...item,
          categoryImg: categoryData.categoryImg,
        };
        flatProducts.push(productWithCategoryImg);
      }
    }

    // Insert sample products from data file
    const seededProducts = await Product.insertMany(flatProducts);

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

// Get product brands
const getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    res.status(200).json({
      success: true,
      message: "Brands fetched successfully",
      data: brands,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching brands",
      error: error.message,
    });
  }
};

// Get subcategories by category (brands in this case)
const getSubCategories = async (req, res) => {
  try {
    const { category } = req.params;
    const brands = await Product.distinct("brand", {
      category: category.toLowerCase(),
    });
    res.status(200).json({
      success: true,
      message: "Brands fetched successfully",
      data: brands,
      category: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching brands",
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

// Get featured products (latest, flash sales, discounted)
const getFeaturedProducts = async (req, res) => {
  try {
    const latest = await Product.find({ isLatest: true }).limit(6);
    const flashSales = await Product.find({ isFlashSale: true }).limit(6);
    const discounted = await Product.find({ isDiscount: true }).limit(6);
    const featured = await Product.find({ isFeature: true }).limit(6);
    const bestSellers = await Product.find({ isBestSeller: true }).limit(6);

    res.status(200).json({
      success: true,
      message: "Featured products fetched successfully",
      data: {
        latest,
        flashSales,
        discounted,
        featured,
        bestSellers,
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
    const brandsCount = await Product.distinct("brand").then(
      (brands) => brands.length,
    );
    const latestCount = await Product.countDocuments({ isLatest: true });
    const discountedCount = await Product.countDocuments({ isDiscount: true });
    const flashSaleCount = await Product.countDocuments({ isFlashSale: true });
    const featuredCount = await Product.countDocuments({ isFeature: true });
    const bestSellersCount = await Product.countDocuments({
      isBestSeller: true,
    });
    const inStockCount = await Product.countDocuments({ isStock: true });

    res.status(200).json({
      success: true,
      message: "Product statistics fetched successfully",
      data: {
        totalProducts,
        categoriesCount,
        brandsCount,
        latestCount,
        discountedCount,
        flashSaleCount,
        featuredCount,
        bestSellersCount,
        inStockCount,
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
  createProduct,
  seedProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
  getSubCategories,
  getProductsByCategory,
  getFeaturedProducts,
  getProductStats,
};
