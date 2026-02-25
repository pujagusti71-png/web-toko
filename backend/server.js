const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { initializeDatabase } = require('./database/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/checkout', require('./routes/checkout'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/orders-api', require('./routes/orders-api'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'API Toko Pakaian' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Inisialisasi database dan start server
(async () => {
  try {
    await initializeDatabase();
    
    const server = app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });

    // Handle port already in use error
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} sudah digunakan!`);
        console.error('Solusi:');
        console.error(`1. Tutup aplikasi lain yang pakai port ${PORT}`);
        console.error(`2. Atau jalankan: netstat -ano | findstr :${PORT}`);
        console.error(`3. Kemudian kill process dengan: taskkill /PID <PID> /F`);
      } else {
        console.error('Server error:', err);
      }
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\n🛑 SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('✓ HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n🛑 SIGINT signal received: closing HTTP server');
      server.close(() => {
        console.log('✓ HTTP server closed');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();

module.exports = app;
