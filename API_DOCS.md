# E-Commerce Server API Documentation

## Base URL

```
http://localhost:5000
```

## 🚀 Server Endpoints

### Health Check

- **GET** `/health` - Check server health

### Root

- **GET** `/` - Server information and available endpoints

---

## 📦 Products API

### Get All Products (with filtering & pagination)

- **GET** `/api/products/allProducts`

**Query Parameters:**

- `category` - Filter by category
- `subCategory` - Filter by subcategory
- `hasDiscount` - Filter by discount (true/false)
- `isNewArrival` - Filter by new arrivals (true/false)
- `flashSale` - Filter by flash sale (true/false)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `search` - Search in name, description, category
- `sort` - Sort field (default: createdAt)
- `order` - Sort order: asc/desc (default: desc)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

**Example:**

```
GET /api/products/allProducts?category=mens fashion&hasDiscount=true&page=1&limit=10
```

### Create Product

- **POST** `/api/products/createProduct`

**Request Body:**

```json
{
  "name": "Product Name",
  "price": 25.99,
  "shortDescription": "Short description",
  "longDescription": "Detailed description",
  "category": "mens fashion",
  "subCategory": "shirts",
  "materials": ["Cotton", "Polyester"],
  "hasDiscount": true,
  "isNewArrival": false,
  "flashSale": false,
  "images": {
    "primary": "https://example.com/image.jpg",
    "detail": ["https://example.com/detail1.jpg"]
  },
  "discount": 15,
  "stockQuantity": 100,
  "variants": [{ "size": "M", "color": "Blue", "stock": 50 }]
}
```

### Get Single Product

- **GET** `/api/products/:id`

### Update Product

- **PUT** `/api/products/:id`

### Delete Product

- **DELETE** `/api/products/:id`

### Seed Database

- **POST** `/api/products/seed`
- Populates database with sample data from `products-data.js`

### Get Categories

- **GET** `/api/products/categories`

### Get Subcategories by Category

- **GET** `/api/products/categories/:category/subcategories`

### Get Products by Category

- **GET** `/api/products/categories/:category`
- Query params: `page`, `limit`

### Get Featured Products

- **GET** `/api/products/featured`
- Returns new arrivals, flash sales, and discounted products

### Get Product Statistics

- **GET** `/api/products/stats`
- Returns counts of total products, categories, new arrivals, etc.

### Testing Endpoint

- **GET** `/api/products/testing`

---

## 🔧 Usage Examples

### 1. Start Server

```bash
npm run dev
```

### 2. Seed Database

```bash
curl -X POST http://localhost:5000/api/products/seed
```

### 3. Get All Products

```bash
curl http://localhost:5000/api/products/allProducts
```

### 4. Search Products

```bash
curl "http://localhost:5000/api/products/allProducts?search=shirt&category=mens fashion"
```

### 5. Get Featured Products

```bash
curl http://localhost:5000/api/products/featured
```

---

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Description of action",
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## 🗄️ Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/ecommerce
NODE_ENV=development
```

---

## 🚀 Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file with your MongoDB connection string

3. Start server:

```bash
npm run dev
```

4. Seed database:

```bash
curl -X POST http://localhost:5000/api/products/seed
```

5. Test API:

```bash
curl http://localhost:5000/api/products/allProducts
```
