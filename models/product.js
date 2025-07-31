const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
});

const imagesSchema = new mongoose.Schema({
  primary: {
    type: String,
    required: true,
    trim: true,
  },
  detail: [
    {
      type: String,
      trim: true,
    },
  ],
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: [500, "Short description cannot exceed 500 characters"],
    },
    longDescription: {
      type: String,
      required: [true, "Long description is required"],
      trim: true,
      maxlength: [2000, "Long description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      lowercase: true,
    },
    subCategory: {
      type: String,
      required: [true, "Sub-category is required"],
      trim: true,
      lowercase: true,
    },
    materials: [
      {
        type: String,
        trim: true,
      },
    ],
    hasDiscount: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    flashSale: {
      type: Boolean,
      default: false,
    },
    images: {
      type: imagesSchema,
      required: [true, "Product images are required"],
    },
    discount: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
      default: 0,
    },
    discountedPrice: {
      type: Number,
      min: [0, "Discounted price cannot be negative"],
    },
    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock quantity cannot be negative"],
      default: 0,
    },
    variants: [variantSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Pre-save middleware to calculate discounted price
productSchema.pre("save", function (next) {
  if (this.hasDiscount && this.discount > 0) {
    this.discountedPrice = this.price * (1 - this.discount / 100);
  } else {
    this.discountedPrice = this.price;
  }
  next();
});

// Virtual to get effective price (discounted or regular)
productSchema.virtual("effectivePrice").get(function () {
  return this.hasDiscount ? this.discountedPrice : this.price;
});

// Virtual to check if product is in stock
productSchema.virtual("inStock").get(function () {
  return this.stockQuantity > 0;
});

// Index for search optimization
productSchema.index({
  name: "text",
  shortDescription: "text",
  longDescription: "text",
});
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ hasDiscount: 1 });
productSchema.index({ flashSale: 1 });

const Product = mongoose.model("Product", productSchema, "all_products");

module.exports = Product;
