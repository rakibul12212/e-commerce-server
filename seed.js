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

    // Insert sample products
    const seededProducts = await Product.insertMany(flatProducts);
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
