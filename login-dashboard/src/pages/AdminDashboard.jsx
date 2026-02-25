import { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { productAPI } from "../api/api";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
    category: ""
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsRes = await fetch("http://localhost:5000/api/products");
      const productsData = await productsRes.json();
      const products = Array.isArray(productsData) ? productsData : [];
      setProducts(products);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    try {
      if (!formData.name || !formData.price) {
        setMessage("Nama dan harga produk wajib diisi!");
        return;
      }

      let result;
      if (editingId) {
        result = await productAPI.update(
          editingId,
          formData.name,
          formData.description,
          parseFloat(formData.price),
          parseInt(formData.stock) || 0,
          formData.image_url,
          formData.category
        );
      } else {
        result = await productAPI.create(
          formData.name,
          formData.description,
          parseFloat(formData.price),
          parseInt(formData.stock) || 0,
          formData.image_url,
          formData.category
        );
      }

      if (result.success) {
        setMessage(`Produk berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}!`);
        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
          image_url: "",
          category: ""
        });
        setEditingId(null);
        setShowForm(false);
        fetchProducts();
      } else {
        setMessage(result.error || "Error saat menyimpan produk");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
      console.error("Error:", err);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock || 0,
      image_url: product.image_url || "",
      category: product.category || ""
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      const result = await productAPI.delete(productId);
      if (result.success) {
        setMessage("Produk berhasil dihapus!");
        fetchProducts();
      } else {
        setMessage(result.error || "Error saat menghapus produk");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
      console.error("Error:", err);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      image_url: "",
      category: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(num);
  };

  if (loading) {
    return <div className="loading">Memuat dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      
      {message && <div className="alert alert-info">{message}</div>}

      {/* Add Product Button */}
      {user.role === "admin" && (
        <div className="form-section">
          {!showForm ? (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Tambah Produk Baru
            </button>
          ) : (
            <form className="product-form" onSubmit={handleSubmit}>
              <h2>{editingId ? "Edit Produk" : "Tambah Produk Baru"}</h2>
              
              <div className="form-group">
                <label>Nama Produk *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama produk"
                  required
                />
              </div>

              <div className="form-group">
                <label>Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Masukkan deskripsi produk"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Harga (Rp) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stok</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kategori</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Misal: Kaos, Kemeja, Celana"
                  />
                </div>

                <div className="form-group">
                  <label>Gambar/Emoji</label>
                  <input
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="Misal: 👔 atau /image.png"
                  />
                </div>
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn btn-success">
                  {editingId ? "Simpan Perubahan" : "Tambah Produk"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      
      {/* Products Section */}
      <div className="products-section">
        <h2>Daftar Produk ({products.length})</h2>
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
                      <img src={`/${product.image_url}`} alt={product.name} onError={(e) => {e.target.style.display = 'none'}} />
                    ) : (
                      <div className="product-placeholder">{product.image_url || '👔'}</div>
                    )}
                  </div>
                  <div className="product-details">
                    <h3>{product.name}</h3>
                    <p className="product-price">{formatCurrency(product.price)}</p>
                    <p className="product-stock">Stok: {product.stock || 0}</p>
                    <p className="product-category">{product.category || "Pakaian"}</p>
                    
                    {user.role === "admin" && (
                      <div className="product-actions">
                        <button 
                          className="btn btn-sm btn-warning"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(product.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
