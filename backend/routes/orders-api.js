const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database/db');

// Get all orders
router.get('/', (req, res) => {
  try {
    const orders = dbHelpers.getAll('orders');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Error saat mengambil orders' });
  }
});

// Get order by ID
router.get('/:orderId', (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = dbHelpers.getAll('orders').find(o => o.orderId === orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Error saat mengambil order' });
  }
});

// Create order (checkout)
router.post('/', (req, res) => {
  try {
    const { userId, totalAmount, paymentMethod, shippingAddress, cartItems } = req.body;

    if (!totalAmount || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Data order tidak lengkap' });
    }

    const orders = dbHelpers.getAll('orders');
    const orderId = 'ORD-' + String(orders.length + 1).padStart(3, '0');
    
    const newOrder = dbHelpers.insert('orders', {
      orderId,
      userId: userId || 'guest',
      date: new Date().toISOString().split('T')[0],
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: totalAmount,
      status: 'Menunggu Pembayaran',
      statusColor: 'pending',
      paymentMethod: paymentMethod || 'pending',
      shippingAddress: shippingAddress || 'Belum diset'
    });

    res.status(201).json({
      success: true,
      message: 'Order berhasil dibuat',
      order: newOrder
    });
  } catch (err) {
    res.status(500).json({ error: 'Error saat membuat order' });
  }
});

// Update order status
router.put('/:orderId/status', (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;

    const orders = dbHelpers.getAll('orders');
    const orderIndex = orders.findIndex(o => o.orderId === orderId);
    
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

    const updatedOrder = dbHelpers.update('orders', orders[orderIndex].id, { status });
    
    res.json({ 
      success: true, 
      message: 'Status order diperbarui', 
      order: updatedOrder 
    });
  } catch (err) {
    res.status(500).json({ error: 'Error saat mengupdate order' });
  }
});

module.exports = router;
