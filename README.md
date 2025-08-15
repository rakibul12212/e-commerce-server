# E-Commerce Server API Documentation

## Overview

This is a comprehensive E-Commerce Server API built with Node.js, Express, and MongoDB. The server provides full CRUD operations for product management with advanced filtering, searching, and categorization features.



## Base URL

```
http://localhost:5000
```

## Authentication

Currently, no authentication is required for API access.

## Endpoints

### Server Status

- **GET /** - Server information and available endpoints
- **GET /health** - Health check endpoint

### Products

#### Get All Products (No Pagination)

```
GET /api/products/allProducts
```

**Returns ALL products matching the specified filters - no pagination limits applied**



#### Get Product Statistics

```
GET /api/products/stats
```

Returns comprehensive statistics about products in the database.

#### Get Product Categories

```
GET /api/products/categories
```

Returns all available product categories.

#### Get Product Brands

```
GET /api/products/brands
```

Returns all available product brands.

#### Get Featured Products

```
GET /api/products/featured
```



#### Get Products by Category

```
GET /api/products/categories/{category}
```

Returns all products in a specific category.

#### Get Subcategories (Brands by Category)

```
GET /api/products/categories/{category}/subcategories
```

Returns all brands available in a specific category.

#### Get Single Product

```
GET /api/products/{id}
```

Returns detailed information about a specific product.

#### Create Product

```
POST /api/products/createProduct
```

Creates a new product. Requires all mandatory fields.

#### Update Product

```
PUT /api/products/{id}
```

Updates an existing product.

#### Delete Product

```
DELETE /api/products/{id}
```

Deletes a product from the database.

#### Seed Database

```
POST /api/products/seed
```

Seeds the database with sample products data. **Caution**: This will clear all existing products.



## Error Handling

- **400** - Bad Request (validation errors)
- **404** - Not Found (resource doesn't exist)
- **500** - Internal Server Error

## Examples

### Get All Smartphones

```bash
curl "http://localhost:5000/api/products/allProducts?category=smartphone"
```

### Search for Samsung Products

```bash
curl "http://localhost:5000/api/products/allProducts?search=Samsung"
```

### Get Discounted Products Under $1000

```bash
curl "http://localhost:5000/api/products/allProducts?isDiscount=true&maxPrice=1000"
```

### Get Product Statistics

```bash
curl "http://localhost:5000/api/products/stats"
```


