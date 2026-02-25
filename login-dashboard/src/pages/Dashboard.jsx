import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ambil user dari localStorage atau location state
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const username = location.state?.user?.name || userData.name || "Pelanggan";
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check apakah user adalah admin - jika ya, redirect ke admin dashboard
  // Fetch products dari API
  useEffect(() => {
    if (userData.role === "admin") {
      navigate("/admin/dashboard");
    }
    
    // Load cart dari localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);

    // Fetch products dari API
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        const productsData = Array.isArray(data) ? data : [];
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Refresh setiap 5 detik untuk selalu update
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, [userData.role, navigate]);

  const handleLogout = () => {
    navigate("/");
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Show notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="dashboard-container">
      {/* Notification */}
      {showNotification && (
        <div className="notification">
          ✓ Produk berhasil ditambahkan ke keranjang!
        </div>
      )}

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h2>Selamat datang, {username}! 👋</h2>
          <p>Kelola dan lihat semua koleksi pakaian terbaru Anda di sini</p>
        </section>

        {/* Products Section */}
        <section className="products-section">
          <div className="section-header">
            <h2>📍 Koleksi Pakaian Terbaru</h2>
            <p>Temukan koleksi pakaian pilihan kami</p>
          </div>

          {loading ? (
            <div className="loading">Memuat produk...</div>
          ) : (
            <div className="products-grid">
              {products.length === 0 ? (
                <div className="no-data">Belum ada produk</div>
              ) : (
                products.map((product) => {
                  const isEmoji = product.image_url && /[\p{Emoji}]/u.test(product.image_url);
                  const isImageFile = product.image_url && (product.image_url.endsWith('.png') || product.image_url.endsWith('.jpg'));

                  return (
                    <div key={product.id} className="product-card">
                      <div className="product-image">
                        {isImageFile ? (
                          <img 
                            src={`/${product.image_url}`} 
                            alt={product.name}
                            className="product-img"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <span className="clothing-emoji">{product.image_url || '👔'}</span>
                        )}
                      </div>
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p className="product-price">{formatCurrency(product.price)}</p>
                        <p className="product-stock">Stok: {product.stock || 0}</p>
                        <button 
                          className="add-cart-btn"
                          onClick={() => handleAddToCart(product)}
                        >
                          + Keranjang
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </section>

        {/* Info Cards */}
        <section className="info-cards">
          <div className="info-card blue-card">
            <h4>🎁 Promo Spesial</h4>
            <p>Dapatkan diskon hingga 30% untuk pembelian pakaian pilihan hari ini!</p>
          </div>
          <div className="info-card green-card">
            <h4>🚚 Pengiriman Gratis</h4>
            <p>Gratis ongkir untuk pembelian minimal Rp 100.000 ke seluruh Indonesia.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
