-- CREATE TABLES
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,
  stock INT NOT NULL,
  image_url VARCHAR(255),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  total_price BIGINT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id),
  product_id INT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  price BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  product_id INT NOT NULL REFERENCES products(id),
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERT DATA DUMMY KE TABEL USERS
INSERT INTO users (email, password, name, phone, address, role) VALUES
('admin@toko.com', 'admin123', 'Admin Toko', '081234567890', 'Jl. Admin No.1', 'admin'),
('customer1@email.com', 'password1', 'Budi Santoso', '081234567891', 'Jl. Merdeka No.10', 'customer'),
('customer2@email.com', 'password2', 'Siti Nurhaliza', '081234567892', 'Jl. Gatot Subroto No.20', 'customer'),
('customer3@email.com', 'password3', 'Ahmad Wijaya', '081234567893', 'Jl. Sudirman No.30', 'customer'),
('customer4@email.com', 'password4', 'Rini Kartika', '081234567894', 'Jl. Ahmad Yani No.40', 'customer');

-- INSERT DATA DUMMY KE TABEL PRODUCTS (Sesuai dengan Dashboard produk)
INSERT INTO products (name, description, price, stock, image_url, category) VALUES
('T-Shirt Premium', 'T-Shirt berkualitas premium dengan bahan cotton 100%', 149999, 100, '/T-Shirt Premium.png', 'Kaos'),
('Kemeja Formal', 'Kemeja formal yang elegan untuk acara bisnis', 249999, 80, '/Kemeja Formal.png', 'Kemeja'),
('Celana Jeans', 'Celana jeans premium dengan fit yang sempurna', 299999, 60, '/Celana Jeans.png', 'Celana'),
('Dress Casual', 'Dress kasual yang nyaman dan stylish', 225000, 75, '/Dress Casual.png', 'Dress'),
('Jaket Denim', 'Jaket denim klasik yang timeless dan versatile', 399999, 45, '/Jaket Denim.png', 'Jaket'),
('Sweater Wool', 'Sweater wool premium dengan desain minimalis', 349999, 55, '🧶', 'Sweater'),
('Shorts Casual', 'Celana pendek kasual untuk aktivitas sehari-hari', 174999, 90, '🩳', 'Celana'),
('Hoodie Sport', 'Hoodie sporty dengan material nyaman dan breathable', 274999, 70, '🏃', 'Hoodie'),
('Kaos Polos', 'Kaos polos berkualitas dengan berbagai pilihan warna', 124999, 150, '👕', 'Kaos'),
('Blazer Formal', 'Blazer formal untuk tampilan profesional', 449999, 35, '🎩', 'Blazer'),
('Celana Chino', 'Celana chino nyaman untuk casual atau semi-formal', 224999, 80, '👖', 'Celana'),
('Vest Outdoor', 'Vest outdoor dengan material tahan cuaca', 324999, 50, '🧤', 'Vest');

-- INSERT DATA DUMMY KE TABEL CARTS
INSERT INTO carts (user_id, product_id, quantity) VALUES
(2, 1, 2),
(2, 3, 1),
(3, 5, 1),
(4, 6, 2);

-- INSERT DATA DUMMY KE TABEL ORDERS
INSERT INTO orders (user_id, total_price, status) VALUES
(2, 699997, 'completed'),
(3, 399999, 'completed'),
(4, 424998, 'pending'),
(5, 649998, 'processing');

-- INSERT DATA DUMMY KE TABEL ORDER_ITEMS
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 149999),
(1, 3, 1, 299999),
(2, 5, 1, 399999),
(3, 6, 2, 349999),
(3, 9, 1, 124999),
(4, 2, 1, 249999),
(4, 4, 1, 225000),
(4, 7, 1, 174999);