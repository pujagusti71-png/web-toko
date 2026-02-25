import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      setCartItems(items);
      calculateTotal(items);
    }
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(total);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { cartItems, totalPrice } });
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <button className="back-btn" onClick={handleBackToDashboard}>← Kembali</button>
        <h1>🛒 Keranjang Belanja</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Keranjang belanja Anda kosong</p>
          <button className="shop-btn" onClick={handleBackToDashboard}>
            Kembali Berbelanja
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Harga</th>
                  <th>Jumlah</th>
                  <th>Subtotal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id}>
                    <td className="product-name">{item.name}</td>
                    <td>Rp {item.price.toLocaleString('id-ID')}</td>
                    <td>
                      <div className="quantity-control">
                        <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                        />
                        <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-summary">
            <h2>Ringkasan Pesanan</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="summary-row">
              <span>Ongkos Kirim:</span>
              <span>Rp 50.000</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>Rp {(totalPrice + 50000).toLocaleString('id-ID')}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Lanjut ke Pembayaran
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
