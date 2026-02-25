// Middleware untuk mengecek apakah user adalah admin
const checkAdmin = (req, res, next) => {
  try {
    // Ambil user info dari request body atau headers
    const user = req.body.user || req.headers['x-user'];
    
    if (!user) {
      return res.status(401).json({ 
        error: 'User tidak terautentikasi. Login terlebih dahulu.' 
      });
    }

    // Parse user jika string
    let userData = typeof user === 'string' ? JSON.parse(user) : user;

    // Cek apakah user adalah admin
    if (userData.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Akses ditolak. Hanya admin yang dapat melakukan aksi ini.' 
      });
    }

    // Simpan user info di req untuk digunakan di route handler
    req.user = userData;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ 
      error: 'Error saat autentikasi user' 
    });
  }
};

module.exports = { checkAdmin };
