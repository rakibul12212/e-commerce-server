const mongoose = require("mongoose");
require("dotenv").config();

// Import the Product model
const Product = require("./models/product");

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    // Check total products
    const totalProducts = await Product.countDocuments();
    console.log(`📊 Total products in database: ${totalProducts}`);

    // Get a sample of products
    const sampleProducts = await Product.find().limit(3);
    console.log(`📦 Sample products:`);
    sampleProducts.forEach((product, index) => {
      console.log(
        `${index + 1}. ${product.name} - $${product.price} (Category: ${
          product.category
        })`,
      );
    });

    // Check collection name
    console.log(`📋 Collection name: ${Product.collection.name}`);

    // List all collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "📁 Available collections:",
      collections.map((c) => c.name),
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔒 Database connection closed");
  }
}

checkDatabase();
