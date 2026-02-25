import { useState, useEffect } from "react";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Tidak ada query params, jadi ambil semua orders
      const response = await fetch("http://localhost:5000/api/orders");
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Gagal memuat pesanan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Update local state
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        setError(data.error || 'Gagal update status');
      }
    } catch (err) {
      setError('Error saat update status');
      console.error(err);
    }
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(num);
  };

  const getStatusColor = (status) => {
    const colors = {
      "completed": "completed",
      "processing": "processing",
      "pending": "pending"
    };
    return colors[status?.toLowerCase()] || "pending";
  };

  const getStatusLabel = (status) => {
    const labels = {
      "pending": "MENUNGGU PEMBAYARAN",
      "processing": "DIPROSES",
      "completed": "SELESAI"
    };
    return labels[status?.toLowerCase()] || status?.toUpperCase() || "UNKNOWN";
  };

  if (loading) {
    return <div className="loading">Memuat pesanan...</div>;
  }

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h1>📋 Pesanan Semua Customer</h1>
        <p className="orders-count">Total: {orders.length} pesanan</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="orders-table-wrapper">
        {orders.length === 0 ? (
          <div className="no-data">
            <p>Belum ada pesanan</p>
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>PRODUK</th>
                <th>PELANGGAN</th>
                <th>EMAIL</th>
                <th>TANGGAL</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="order-product">{order.products || "-"}</td>
                  <td className="customer-name">{order.customerName || "Unknown"}</td>
                  <td className="customer-email">{order.customerEmail || "-"}</td>
                  <td className="order-date">{order.created_at || "-"}</td>
                  <td className="order-total">{formatCurrency(order.total || 0)}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="order-actions">
                    {order.status?.toLowerCase() !== 'completed' && (
                      <>
                        {order.status?.toLowerCase() === 'pending' && (
                          <button
                            className="btn-action btn-processing"
                            onClick={() => handleUpdateStatus(order.id, 'processing')}
                            title="Ubah status ke Diproses"
                          >
                            Proses
                          </button>
                        )}
                        {order.status?.toLowerCase() === 'processing' && (
                          <button
                            className="btn-action btn-completed"
                            onClick={() => handleUpdateStatus(order.id, 'completed')}
                            title="Ubah status ke Selesai"
                          >
                            Selesaikan
                          </button>
                        )}
                      </>
                    )}
                    {order.status?.toLowerCase() === 'completed' && (
                      <span className="status-completed">✓ Selesai</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
