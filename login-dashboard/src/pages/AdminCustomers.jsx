import { useState, useEffect } from "react";
import "./AdminCustomers.css";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/users");
      const data = await response.json();
      // Filter hanya customer, bukan admin
      const customerOnly = Array.isArray(data) ? data.filter(user => user.role === "customer") : [];
      setCustomers(customerOnly);
    } catch (err) {
      setError("Gagal memuat pelanggan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
  };

  const closeDetailModal = () => {
    setSelectedCustomer(null);
  };

  if (loading) {
    return <div className="loading">Memuat pelanggan...</div>;
  }

  return (
    <div className="admin-customers">
      <div className="customers-header">
        <h1>Pelanggan</h1>
        <p className="customers-count">Total: {customers.length} pelanggan</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="customers-table-wrapper">
        {customers.length === 0 ? (
          <div className="no-data">
            <p>Belum ada pelanggan</p>
          </div>
        ) : (
          <table className="customers-table">
            <thead>
              <tr>
                <th>NAMA</th>
                <th>EMAIL</th>
                <th>TELEPON</th>
                <th>ALAMAT</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="customer-name">{customer.name || "-"}</td>
                  <td className="customer-email">{customer.email || "-"}</td>
                  <td className="customer-phone">{customer.phone || "-"}</td>
                  <td className="customer-address">{customer.address || "-"}</td>
                  <td className="action-cell">
                    <button 
                      className="btn-view"
                      onClick={() => handleViewCustomer(customer)}
                    >
                      Lihat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selectedCustomer && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detail Pelanggan</h2>
              <button className="close-btn" onClick={closeDetailModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <label>Nama:</label>
                <span>{selectedCustomer.name || "-"}</span>
              </div>
              <div className="detail-row">
                <label>Email:</label>
                <span>{selectedCustomer.email || "-"}</span>
              </div>
              <div className="detail-row">
                <label>Telepon:</label>
                <span>{selectedCustomer.phone || "-"}</span>
              </div>
              <div className="detail-row">
                <label>Alamat:</label>
                <span>{selectedCustomer.address || "-"}</span>
              </div>
              <div className="detail-row">
                <label>Tanggal Bergabung:</label>
                <span>{selectedCustomer.created_at ? new Date(selectedCustomer.created_at).toLocaleDateString('id-ID') : "-"}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-close" onClick={closeDetailModal}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCustomers;
