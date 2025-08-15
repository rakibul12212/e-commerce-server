const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const connectDb = require("./db/connect");
require("dotenv").config();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
const products_routes = require("./routes/products");
app.use("/api/products", products_routes);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: " E-Commerce Server is Running Successfully!",
    version: "1.0.0",
    endpoints: {
      products: "/api/products/allProducts",
      categories: "/api/products/categories",
      featured: "/api/products/featured",
      stats: "/api/products/stats",
      seed: "/api/products/seed",
    },
  });
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const Product = require("./models/product");
    const productCount = await Product.countDocuments();

    res.status(200).json({
      success: true,
      message: "Server is healthy",
      timestamp: new Date().toISOString(),
      database: {
        connected: mongoose.connection.readyState === 1,
        productCount: productCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server health check failed",
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// Connect to database
const startServer = async () => {
  try {
    await connectDb(process.env.MONGO_URL);
    console.log("✅ Database connected successfully");

    // Auto-seed database if empty (for production deployment)
    const Product = require("./models/product");
    const productCount = await Product.countDocuments();

    if (productCount === 0) {
      console.log("🌱 Database is empty, auto-seeding...");
      try {
        const { seedProducts } = require("./controllers/products");
        // Create a mock response object
        const mockRes = {
          status: () => mockRes,
          json: (data) => {
            if (data.success) {
              console.log(
                `✅ Auto-seed completed: ${data.count} products added`,
              );
            } else {
              console.error("❌ Auto-seed failed:", data.message);
            }
            return mockRes;
          },
        };
        await seedProducts({}, mockRes);
      } catch (seedError) {
        console.error("❌ Auto-seed error:", seedError.message);
      }
    } else {
      console.log(`📦 Database contains ${productCount} products`);
    }
  } catch (error) {
    console.error("❌ Failed to connect to database:", error.message);
    process.exit(1);
  }
};

// Initialize database connection
startServer();

// For Vercel deployment, export the app
module.exports = app;

// For local development
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
}
