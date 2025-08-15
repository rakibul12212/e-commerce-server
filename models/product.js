const mongoose = require("mongoose");

const specificationsSchema = new mongoose.Schema(
  {
    display: String,
    processor: String,
    ram: String,
    storage: String,
    camera: String,
    battery: String,
    os: String,
    connectivity: String,
    weight: String,
    dimensions: String,
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
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
    discountPercent: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
      default: 0,
    },
    primaryImg: {
      type: String,
      required: [true, "Primary image is required"],
      trim: true,
    },
    detailsImg: [
      {
        type: String,
        trim: true,
      },
    ],
    shortDetails: {
      type: String,
      required: [true, "Short details is required"],
      trim: true,
      maxlength: [500, "Short details cannot exceed 500 characters"],
    },
    longDetails: {
      type: String,
      required: [true, "Long details is required"],
      trim: true,
      maxlength: [2000, "Long details cannot exceed 2000 characters"],
    },
    specifications: specificationsSchema,
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      lowercase: true,
    },
    categoryImg: {
      type: String,
      trim: true,
    },
    isStock: {
      type: Boolean,
      default: true,
    },
    isDiscount: {
      type: Boolean,
      default: false,
    },
    PID: {
      type: String,
      required: true,
      trim: true,
    },
    SKU: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    warranty: {
      type: String,
      default: "1 year",
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
      default: 0,
    },
    isWarranty: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock quantity cannot be negative"],
      default: 0,
    },
    isFeature: {
      type: Boolean,
      default: false,
    },
    isFlashSale: {
      type: Boolean,
      default: false,
    },
    isLatest: {
      type: Boolean,
      default: false,
    },
    deals: {
      type: String,
      trim: true,
    },
    isDeal: {
      type: Boolean,
      default: false,
    },
    reviewCount: {
      type: Number,
      min: [0, "Review count cannot be negative"],
      default: 0,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Pre-save middleware to calculate discounted price
productSchema.pre("save", function (next) {
  if (this.isDiscount && this.discountPercent > 0) {
    this.discountedPrice = this.price * (1 - this.discountPercent / 100);
  } else {
    this.discountedPrice = this.price;
  }
  next();
});

// Virtual to get effective price (discounted or regular)
productSchema.virtual("effectivePrice").get(function () {
  return this.isDiscount && this.discountPercent > 0
    ? this.price * (1 - this.discountPercent / 100)
    : this.price;
});

// Virtual to check if product is in stock
productSchema.virtual("inStock").get(function () {
  return this.isStock && this.stockQuantity > 0;
});

// Index for search optimization
productSchema.index({
  name: "text",
  shortDetails: "text",
  longDetails: "text",
  brand: "text",
  model: "text",
});
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: 1 });
productSchema.index({ isLatest: 1 });
productSchema.index({ isDiscount: 1 });
productSchema.index({ isFlashSale: 1 });
productSchema.index({ isFeature: 1 });
productSchema.index({ isBestSeller: 1 });

const Product = mongoose.model("Product", productSchema, "all_products");

module.exports = Product;
