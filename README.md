# Toko Pakaian - Backend & Frontend Setup

Dokumentasi lengkap untuk menjalankan aplikasi Toko Pakaian dengan backend Node.js dan frontend React.

## 📁 Struktur Folder

```
TOKO PAKAIAN WEB/
├── login-dashboard/          (Frontend React)
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js        (API Client)
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Checkout.jsx  (Halaman Checkout)
│   │   └── App.jsx
│   └── package.json
│
└── backend/                   (Node.js Backend)
    ├── database/
    │   └── db.js              (Database Setup)
    ├── routes/
    │   ├── users.js           (User endpoints)
    │   ├── products.js        (Product endpoints)
    │   ├── checkout.js        (Cart endpoints)
    │   └── orders.js          (Order/Checkout endpoints)
    ├── server.js              (Main server)
    ├── package.json
    └── .env                   (Environment variables)
```

## 🚀 Setup Awal

### 1. Backend Setup

Buka terminal di folder `backend`:

```powershell
cd backend
npm install
```

Tunggu sampai semua dependencies terinstall.

### 2. Frontend Setup

Buka terminal baru di folder `login-dashboard`:

```powershell
cd login-dashboard
npm install
```

## ▶️ Menjalankan Aplikasi

### Start Backend Server

Dari folder `backend`, jalankan:

```powershell
npm start
```

Atau untuk mode development (dengan auto-reload):

```powershell
npm run dev
```

Server akan berjalan di: `http://localhost:5000`

### Start Frontend (React)

Dari folder `login-dashboard`, jalankan:

```powershell
npm start
```

Frontend akan otomatis membuka di: `http://localhost:3000`

## 📡 API Endpoints

### Users API
- **POST** `/api/users/register` - Register user baru
- **POST** `/api/users/login` - Login user
- **GET** `/api/users/:id` - Get profile user
- **PUT** `/api/users/:id` - Update profile user

### Products API
- **GET** `/api/products` - Get semua produk
- **GET** `/api/products/:id` - Get produk by ID
- **POST** `/api/products` - Create produk (admin)
- **PUT** `/api/products/:id` - Update produk (admin)

### Cart API
- **GET** `/api/checkout/:userId` - Get cart user
- **POST** `/api/checkout/:userId/add` - Tambah item ke cart
- **DELETE** `/api/checkout/:userId/remove/:productId` - Hapus item dari cart
- **DELETE** `/api/checkout/:userId/clear` - Kosongkan cart

### Orders API
- **POST** `/api/orders` - Create order (checkout)
- **GET** `/api/orders/user/:userId` - Get orders user
- **GET** `/api/orders/:orderId` - Get detail order
- **PUT** `/api/orders/:orderId/status` - Update status order

## 💾 Database

Aplikasi menggunakan **SQLite** untuk database. Database akan otomatis dibuat saat server pertama kali dijalankan di folder `backend/database/`.

### Tabel-tabel Database:
1. **users** - Data user
2. **products** - Data produk
3. **carts** - Data keranjang belanja
4. **orders** - Data pesanan (checkout)
5. **order_items** - Item dalam pesanan

## 🔄 Flow Checkout

1. User login
2. User memilih produk dan tambah ke cart
3. User klik checkout
4. Isi data pengiriman dan pilih metode pembayaran
5. System membuat order dan simpan di database
6. Cart otomatis dikosongkan
7. User dapat melihat history order

## 📝 Contoh Request & Response

### Register User
```
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "081234567890",
  "address": "Jl. Merdeka No. 1"
}

Response:
{
  "message": "User berhasil didaftarkan",
  "userId": 1
}
```

### Login
```
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
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

### Add to Cart
```
POST /api/checkout/1/add
Content-Type: application/json

{
  "productId": 5,
  "quantity": 2
}

Response:
{
  "message": "Item berhasil ditambahkan ke cart"
}
```

### Checkout / Create Order
```
POST /api/orders
Content-Type: application/json

{
  "userId": 1,
  "totalAmount": 500000,
  "paymentMethod": "transfer",
  "shippingAddress": "Jl. Merdeka No. 1",
  "cartItems": [
    {
      "productId": 5,
      "quantity": 2,
      "price": 250000
    }
  ]
}

Response:
{
  "message": "Order berhasil dibuat",
  "orderId": 10,
  "totalAmount": 500000,
  "status": "pending"
}
```

## 🔗 Mengintegrasikan API ke Frontend

Gunakan file `src/api/api.js` untuk memanggil API:

```javascript
import { userAPI, productAPI, cartAPI, orderAPI } from './api/api';

// Login
const result = await userAPI.login('user@example.com', 'password123');

// Get produk
const products = await productAPI.getAll();

// Add to cart
await cartAPI.addToCart(userId, productId, quantity);

// Checkout
await orderAPI.checkout(userId, totalAmount, paymentMethod, address, cartItems);
```

## ⚙️ Konfigurasi

### Frontend (CORS)
Backend sudah dikonfigurasi dengan CORS untuk menerima request dari frontend di `http://localhost:3000`.

Jika perlu mengubah, edit di `server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Environment Variables (Backend)
Edit file `.env` di folder `backend`:
```
PORT=5000
NODE_ENV=development
DB_PATH=./database/toko.db
```

## 🐛 Troubleshooting

### Error: Port 5000 already in use
- Ubah PORT di `.env` ke nomor lain (misal 5001)
- Atau kill process yang menggunakan port 5000

### Error: Cannot find module
- Pastikan sudah run `npm install` di kedua folder (backend dan frontend)

### Database Error
- Pastikan folder `backend/database/` ada
- Delete file `toko.db` dan jalankan server lagi untuk reset database

### CORS Error di browser
- Pastikan backend running di `http://localhost:5000`
- Pastikan frontend running di `http://localhost:3000`
- Restart kedua server

## 🎯 Fitur yang Sudah Diimplementasi

✅ User Registration & Login
✅ Product Management (CRUD)
✅ Shopping Cart
✅ Checkout & Order Creation
✅ Order History
✅ Order Status Tracking
✅ SQLite Database
✅ REST API Endpoints
✅ CORS Configuration
✅ Error Handling

## 📦 Package Dependencies

### Backend
- **express** - Web framework
- **cors** - Cross-Origin Resource Sharing
- **sqlite3** - Database
- **dotenv** - Environment variables
- **body-parser** - Parse request body
- **nodemon** - Auto-reload (development)

### Frontend
- **react** - UI library
- **react-router-dom** - Routing
- **fetch API** - HTTP client (built-in)

## 📧 Kontak & Support

Untuk pertanyaan atau masalah, periksa error message di console untuk detailnya.

---

**Happy Coding! 🎉**
