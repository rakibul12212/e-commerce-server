# E-Commerce Server

A complete Node.js e-commerce API server with MongoDB integration.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Seed the database:**

```bash
npm run seed
```

3. **Start the server:**

```bash
npm start
# or for development
npm run dev
```

Server runs on: `http://localhost:5000`

## 📊 API Endpoints

### Products

- `GET /api/products/allProducts` - Get all products (with filtering & pagination)
- `POST /api/products/createProduct` - Create a new product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories

- `GET /api/products/categories` - Get all categories
- `GET /api/products/categories/:category` - Get products by category
- `GET /api/products/categories/:category/subcategories` - Get subcategories

### Special Endpoints

- `GET /api/products/featured` - Get featured products
- `GET /api/products/stats` - Get product statistics
- `POST /api/products/seed` - Reseed database

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

## 📋 Features

- ✅ Complete CRUD operations
- ✅ Advanced filtering and search
- ✅ Pagination and sorting
- ✅ Product categories and variants
- ✅ Discount calculations
- ✅ Inventory management
- ✅ MongoDB integration with Mongoose
- ✅ Error handling and validation

## 📖 Database

**Database:** `ecommerce`
**Collection:** `all_products`

The server contains 25 sample products across 6 categories:

- Mens Fashion
- Womens Fashion
- Electronics
- Baby
- Kitchen
- Sports

## 🌐 API Documentation

For detailed API documentation, see [API_DOCS.md](./API_DOCS.md)

## 📱 Example Usage

```bash
# Get all products
curl http://localhost:5000/api/products/allProducts

# Get products with filtering
curl "http://localhost:5000/api/products/allProducts?category=electronics&hasDiscount=true"

# Get statistics
curl http://localhost:5000/api/products/stats
```
