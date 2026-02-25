const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database/db');
const { checkAdmin } = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await dbHelpers.getAll('products');
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Error saat mengambil produk' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await dbHelpers.getOne('products', productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }
    res.json(product);
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ error: 'Error saat mengambil produk' });
  }
});

// Create product
router.post('/', checkAdmin, async (req, res) => {
  try {
    const { name, description, price, stock, image_url, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Nama dan harga produk diperlukan' });
    }

    const newProduct = await dbHelpers.insert('products', {
      name,
      description: description || '',
      price,
      stock: stock || 0,
      image_url: image_url || '',
      category: category || ''
    });

    res.status(201).json({
      success: true,
      message: 'Produk berhasil dibuat',
      product: newProduct
    });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Error saat membuat produk' });
  }
});

// Update product
router.put('/:id', checkAdmin, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, description, price, stock, image_url, category } = req.body;

    const product = await dbHelpers.getOne('products', productId);
    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    const updatedProduct = await dbHelpers.update('products', productId, {
      name: name || product.name,
      description: description !== undefined ? description : product.description,
      price: price || product.price,
      stock: stock !== undefined ? stock : product.stock,
      image_url: image_url || product.image_url,
      category: category || product.category
    });

    res.json({
      success: true,
      message: 'Produk berhasil diperbarui',
      product: updatedProduct
    });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Error saat mengupdate produk' });
  }
});

// Delete product
router.delete('/:id', checkAdmin, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await dbHelpers.getOne('products', productId);

    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    await dbHelpers.delete('products', productId);

    res.json({
      success: true,
      message: 'Produk berhasil dihapus'
    });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Error saat menghapus produk' });
  }
});

module.exports = router;