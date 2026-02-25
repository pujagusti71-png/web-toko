const express = require('express');
const router = express.Router();
const { dbHelpers } = require('../database/db');

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, address } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, dan nama diperlukan' });
    }

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await dbHelpers.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    // Buat user baru
    const newUser = await dbHelpers.insert('users', {
      email,
      password, // Dalam production, harus di-hash!
      name,
      phone: phone || '',
      address: address || '',
      role: 'customer' // Semua user baru otomatis customer
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Silakan login.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Error saat registrasi' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password diperlukan' });
    }

    // Cari user berdasarkan email
    const user = await dbHelpers.getByEmail(email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    res.json({
      success: true,
      message: 'Login berhasil',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Error saat login' });
  }
});

// Get all users (admin)
router.get('/', async (req, res) => {
  try {
    const users = await dbHelpers.getAll('users');
    // Jangan kembalikan password
    const safeUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      phone: u.phone,
      address: u.address,
      role: u.role,
      created_at: u.created_at
    }));
    res.json(safeUsers);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Error saat mengambil users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await dbHelpers.getOne('users', userId);

    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Error saat mengambil user' });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, phone, address } = req.body;

    const user = await dbHelpers.getOne('users', userId);
    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    const updatedUser = await dbHelpers.update('users', userId, {
      name: name || user.name,
      phone: phone || user.phone,
      address: address || user.address
    });

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone,
        address: updatedUser.address
      }
    });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Error saat mengupdate profil' });
  }
});

module.exports = router;
