const mongoose = require("mongoose");
const Product = require("./models/product");
const products = require("./data/products-data");
require("dotenv").config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected for seeding...");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Existing products cleared...");

    // Insert sample products
    const seededProducts = await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${seededProducts.length} products`);

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
