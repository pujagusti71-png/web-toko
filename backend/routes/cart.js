const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database/db');

// Get all cart items
router.get('/', (req, res) => {
  try {
    const carts = dbHelpers.getAll('carts');
    res.json(carts);
  } catch (err) {
    res.status(500).json({ error: 'Error saat mengambil cart' });
  }
});

// Add item to cart
router.post('/add', (req, res) => {
  try {
    const { id, name, price, quantity } = req.body;
    
    if (!id || !name || !price) {
      return res.status(400).json({ error: 'ID, nama, dan harga produk diperlukan' });
    }

    const existingItem = dbHelpers.getOne('carts', id);
    
    let result;
    if (existingItem) {
      result = dbHelpers.update('carts', id, {
        quantity: (existingItem.quantity || 0) + (quantity || 1)
      });
    } else {
      result = dbHelpers.insert('carts', {
        id,
        name,
        price,
        quantity: quantity || 1
      });
    }

    res.json({ 
      success: true, 
      message: 'Produk ditambahkan ke cart', 
      item: result 
    });
  } catch (err) {
    res.status(500).json({ error: 'Error saat menambahkan ke cart' });
  }
});

// Remove item from cart
router.delete('/:productId', (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    dbHelpers.delete('carts', productId);
    res.json({ 
      success: true, 
      message: 'Produk dihapus dari cart'
    });
  } catch (err) {
    res.status(500).json({ error: 'Error saat menghapus dari cart' });
  }
});

// Clear cart
router.post('/clear', (req, res) => {
  try {
    dbHelpers.deleteAll('carts');
    res.json({ success: true, message: 'Cart dikosongkan' });
  } catch (err) {
    res.status(500).json({ error: 'Error saat mengosongkan cart' });
  }
});

module.exports = router;
