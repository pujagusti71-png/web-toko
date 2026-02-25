const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database/db');

// Get all orders (untuk admin) dengan info customer dan produk
router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id;
    
    // Jika ada user_id, fetch hanya pesanan user tersebut
    if (userId) {
      const result = await dbHelpers.query(
        `SELECT o.id, o.user_id, o.total_price, o.status, o.created_at, 
                u.name, u.email,
                COALESCE(STRING_AGG(DISTINCT p.name, ', '), '-') as product_names
         FROM orders o
         LEFT JOIN users u ON o.user_id = u.id
         LEFT JOIN order_items oi ON o.id = oi.order_id
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE o.user_id = $1
         GROUP BY o.id, o.user_id, o.total_price, o.status, o.created_at, u.name, u.email
         ORDER BY o.id DESC`,
        [userId]
      );
      
      const formattedOrders = result.map(order => ({
        id: order.id,
        user_id: order.user_id,
        total: order.total_price,
        status: order.status,
        created_at: order.created_at,
        customerName: order.name,
        customerEmail: order.email,
        products: order.product_names
      }));
      
      return res.json(formattedOrders);
    }
    
    // Jika tidak ada user_id, fetch semua orders (untuk admin)
    const result = await dbHelpers.query(
      `SELECT o.id, o.user_id, o.total_price, o.status, o.created_at,
              u.name, u.email,
              COALESCE(STRING_AGG(DISTINCT p.name, ', '), '-') as product_names
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       GROUP BY o.id, o.user_id, o.total_price, o.status, o.created_at, u.name, u.email
       ORDER BY o.id DESC`
    );
    
    const formattedOrders = result.map(order => ({
      id: order.id,
      user_id: order.user_id,
      total: order.total_price,
      status: order.status,
      created_at: new Date(order.created_at).toLocaleDateString('id-ID'),
      customerName: order.name || 'Unknown',
      customerEmail: order.email || '-',
      products: order.product_names
    }));
    
    res.json(formattedOrders);
  } catch (err) {
    console.error('Error saat mengambil orders:', err);
    res.status(500).json({ error: 'Error saat mengambil orders' });
  }
});

// Create order
router.post('/create', async (req, res) => {
  try {
    const { user_id, total_price, status, items } = req.body;

    if (!user_id || !total_price || !items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'user_id, total_price, dan items harus diisi' 
      });
    }

    // Insert order
    const orderResult = await dbHelpers.query(
      `INSERT INTO orders (user_id, total_price, status, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id`,
      [user_id, total_price, status || 'pending']
    );

    const orderId = orderResult[0].id;

    // Insert order items
    for (const item of items) {
      await dbHelpers.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.id, item.quantity, item.price]
      );
    }

    res.json({ 
      success: true, 
      orderId,
      message: 'Order berhasil dibuat'
    });
  } catch (err) {
    console.error('Error saat membuat order:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Error saat membuat order' 
    });
  }
});

// Get order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const result = await dbHelpers.query(
      `SELECT o.id, o.user_id, o.total_price, o.status, o.created_at,
              u.name, u.email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = $1`,
      [orderId]
    );
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }
    
    const order = result[0];
    res.json({
      id: order.id,
      user_id: order.user_id,
      total: order.total_price,
      status: order.status,
      created_at: order.created_at,
      customerName: order.name,
      customerEmail: order.email
    });
  } catch (err) {
    console.error('Error saat mengambil order:', err);
    res.status(500).json({ error: 'Error saat mengambil order' });
  }
});

// Update order status (untuk admin)
router.put('/:orderId/status', async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status harus diisi' });
    }

    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ 
        error: 'Status tidak valid. Gunakan: pending, processing, completed, atau cancelled' 
      });
    }

    const result = await dbHelpers.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status.toLowerCase(), orderId]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

    res.json({
      success: true,
      message: 'Status order berhasil diupdate',
      order: result[0]
    });
  } catch (err) {
    console.error('Error saat update status:', err);
    res.status(500).json({ error: 'Error saat update status order' });
  }
});

module.exports = router;
