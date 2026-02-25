import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderHistory.css";

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      // Ambil user dari localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (!user.id) {
        navigate("/");
        return;
      }

      // Fetch orders dari API berdasarkan user_id
      const response = await fetch(`http://localhost:5000/api/orders?user_id=${user.id}`);
      const data = await response.json();
      
      // Format data dari API
      const formattedOrders = Array.isArray(data) ? data.map(order => ({
        id: `ORD-${order.id}`,
        date: order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID') : 'Tanggal tidak tersedia',
        total: order.total || 0,
        status: order.status || 'pending',
        statusColor: getStatusColor(order.status || 'pending')
      })) : [];
      
      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      // Fallback ke localStorage jika API gagal
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'delivered';
      case 'processing':
        return 'processing';
      case 'pending':
        return 'pending';
      default:
        return 'pending';
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const getStatusBadge = (statusColor) => {
    switch (statusColor) {
      case 'delivered':
        return '✓ Terkirim';
      case 'processing':
        return '📦 Sedang Diproses';
      case 'pending':
        return '⏳ Menunggu Pembayaran';
      default:
        return statusColor;
    }
  };

  return (
    <div className="order-history-container">
      <div className="order-header">
        <h1>📋 Riwayat Pesanan Saya</h1>
      </div>

      {loading ? (
        <div className="loading">Memuat pesanan...</div>
      ) : orders.length === 0 ? (
        <div className="empty-orders">
          <p>Belum ada riwayat pesanan</p>
          <button className="shop-btn" onClick={handleBackToDashboard}>
            Mulai Berbelanja
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-info">
                  <h3>Pesanan #{order.id}</h3>
                  <p className="order-date">📅 {order.date}</p>
                </div>
                <div className={`status-badge ${order.statusColor}`}>
                  {getStatusBadge(order.statusColor)}
                </div>
              </div>

              <div className="order-footer">
                <div className="total-amount">
                  Total: <span>Rp {order.total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
