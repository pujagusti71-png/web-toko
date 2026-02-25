const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database/db');

// Get checkout page (user's cart items)
router.get('/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const cartItems = await dbHelpers.query(
      `SELECT c.id, c.product_id, c.quantity, p.name, p.price
       FROM carts c
       LEFT JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: 'Error saat mengambil cart' });
  }
});

// Process checkout and create order
router.post('/', async (req, res) => {
  try {
    const { userId, totalAmount, paymentMethod, shippingAddress, cartItems, status } = req.body;

    if (!userId || !totalAmount || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Data checkout tidak lengkap' });
    }

    // Determine status - default pending, but can override from frontend
    const orderStatus = status || 'pending';

    // Create order
    const orderResult = await dbHelpers.query(
      `INSERT INTO orders (user_id, total_price, status, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id`,
      [userId, totalAmount, orderStatus]
    );

    const orderId = orderResult[0].id;

    // Insert order items
    for (const item of cartItems) {
      await dbHelpers.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.id || item.product_id, item.quantity, item.price]
      );
    }

    // Clear cart after successful checkout
    await dbHelpers.query(
      `DELETE FROM carts WHERE user_id = $1`,
      [userId]
    );

    res.status(201).json({
      success: true,
      message: 'Checkout berhasil! Order telah dibuat.',
      orderId: orderId,
      status: orderStatus
    });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Error saat memproses checkout' });
  }
});

module.exports = router;
