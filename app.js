const express = require("express");
const cors = require("cors");
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
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
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
