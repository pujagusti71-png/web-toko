# Backend API Documentation

## Overview
Backend untuk aplikasi Toko Pakaian yang dibangun dengan Node.js dan Express.

## Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

## API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication
Untuk sekarang, user ID dikirim melalui request body atau URL parameter.
Di masa depan, bisa menggunakan JWT tokens.

---

## Users Endpoints

### Register User
**POST** `/users/register`

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "081234567890",
  "address": "Jl. Merdeka No. 1"
}
```

Response:
```json
{
  "message": "User berhasil didaftarkan",
  "userId": 1
}
```

### Login
**POST** `/users/login`

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login berhasil",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "081234567890",
    "address": "Jl. Merdeka No. 1"
  }
}
```

### Get User Profile
**GET** `/users/:userId`

Response:
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "081234567890",
  "address": "Jl. Merdeka No. 1",
  "created_at": "2025-02-03T10:00:00.000Z"
}
```

### Update User Profile
**PUT** `/users/:userId`

Request body:
```json
{
  "name": "Jane Doe",
  "phone": "081987654321",
  "address": "Jl. Sudirman No. 2"
}
```

Response:
```json
{
  "message": "User berhasil diupdate"
}
```

---

## Products Endpoints

### Get All Products
**GET** `/products`

Response:
```json
[
  {
    "id": 1,
    "name": "Kemeja Putih",
    "description": "Kemeja putih casual",
    "price": 150000,
    "stock": 10,
    "image_url": "url",
    "category": "Pria",
    "created_at": "2025-02-03T10:00:00.000Z"
  }
]
```

### Get Product by ID
**GET** `/products/:productId`

Response:
```json
{
  "id": 1,
  "name": "Kemeja Putih",
  "description": "Kemeja putih casual",
  "price": 150000,
  "stock": 10,
  "image_url": "url",
  "category": "Pria",
  "created_at": "2025-02-03T10:00:00.000Z"
}
```

### Create Product
**POST** `/products`

Request body:
```json
{
  "name": "Kemeja Putih",
  "description": "Kemeja putih casual",
  "price": 150000,
  "stock": 10,
  "image_url": "url",
  "category": "Pria"
}
```

Response:
```json
{
  "message": "Produk berhasil dibuat",
  "productId": 1
}
```

### Update Product
**PUT** `/products/:productId`

Request body:
```json
{
  "name": "Kemeja Putih Premium",
  "description": "Kemeja putih premium casual",
  "price": 200000,
  "stock": 15,
  "image_url": "new_url",
  "category": "Pria"
}
```

Response:
```json
{
  "message": "Produk berhasil diupdate"
}
```

---

## Cart Endpoints

### Get User Cart
**GET** `/checkout/:userId`

Response:
```json
[
  {
    "id": 1,
    "user_id": 1,
    "product_id": 5,
    "quantity": 2,
    "name": "Kemeja Putih",
    "price": 150000,
    "image_url": "url"
  }
]
```

### Add to Cart
**POST** `/checkout/:userId/add`

Request body:
```json
{
  "productId": 5,
  "quantity": 2
}
```

Response:
```json
{
  "message": "Item berhasil ditambahkan ke cart"
}
```

### Remove from Cart
**DELETE** `/checkout/:userId/remove/:productId`

Response:
```json
{
  "message": "Item berhasil dihapus dari cart"
}
```

### Clear Cart
**DELETE** `/checkout/:userId/clear`

Response:
```json
{
  "message": "Cart berhasil dikosongkan"
}
```

---

## Orders Endpoints

### Create Order (Checkout)
**POST** `/orders`

Request body:
```json
{
  "userId": 1,
  "totalAmount": 300000,
  "paymentMethod": "transfer",
  "shippingAddress": "Jl. Merdeka No. 1",
  "cartItems": [
    {
      "productId": 5,
      "quantity": 2,
      "price": 150000
    }
  ]
}
```

Response:
```json
{
  "message": "Order berhasil dibuat",
  "orderId": 1,
  "totalAmount": 300000,
  "status": "pending"
}
```

### Get User Orders
**GET** `/orders/user/:userId`

Response:
```json
[
  {
    "id": 1,
    "user_id": 1,
    "total_amount": 300000,
    "status": "pending",
    "payment_method": "transfer",
    "shipping_address": "Jl. Merdeka No. 1",
    "created_at": "2025-02-03T10:00:00.000Z"
  }
]
```

### Get Order Details
**GET** `/orders/:orderId`

Response:
```json
{
  "id": 1,
  "user_id": 1,
  "total_amount": 300000,
  "status": "pending",
  "payment_method": "transfer",
  "shipping_address": "Jl. Merdeka No. 1",
  "created_at": "2025-02-03T10:00:00.000Z",
  "items": [
    {
      "id": 1,
      "order_id": 1,
      "product_id": 5,
      "quantity": 2,
      "price": 150000,
      "name": "Kemeja Putih",
      "image_url": "url"
    }
  ]
}
```

### Update Order Status
**PUT** `/orders/:orderId/status`

Valid status: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

Request body:
```json
{
  "status": "processing"
}
```

Response:
```json
{
  "message": "Status order berhasil diupdate",
  "status": "processing"
}
```

---

## Error Responses

Semua error response mengikuti format:

```json
{
  "error": "Deskripsi error"
}
```

Status codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Database Schema

### users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### products
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### carts
```sql
CREATE TABLE carts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
)
```

### orders
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  total_amount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  shipping_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
```

### order_items
```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
)
```

---

## Future Improvements

- [ ] JWT Authentication
- [ ] Password Hashing (bcrypt)
- [ ] Input Validation & Sanitization
- [ ] Rate Limiting
- [ ] Logging System
- [ ] File Upload for Product Images
- [ ] Payment Gateway Integration
- [ ] Email Notifications
- [ ] Search & Filter for Products
- [ ] Pagination
