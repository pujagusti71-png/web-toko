import { useState } from "react";
import "./AdminSettings.css";

function AdminSettings() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify({
          ...user,
          ...formData
        }));
        setMessage({ type: "success", text: "Profil berhasil diperbarui!" });
      } else {
        setMessage({ type: "error", text: data.error || "Gagal memperbarui profil" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Terjadi kesalahan saat memperbarui profil" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-settings">
      <h1>Pengaturan</h1>

      <div className="settings-container">
        <div className="settings-card">
          <h2>Profile Admin</h2>
          
          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="settings-form">
            <div className="form-group">
              <label htmlFor="name">Nama Lengkap</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                placeholder="Email"
              />
              <small>Email tidak dapat diubah</small>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Nomor Telepon</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Masukkan nomor telepon"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Alamat</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Masukkan alamat"
                rows="4"
              />
            </div>

            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>

        <div className="settings-card">
          <h2>Informasi Sistem</h2>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Versi Aplikasi</span>
              <span className="info-value">v1.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status Server</span>
              <span className="info-value status-online">Online</span>
            </div>
            <div className="info-item">
              <span className="info-label">Database</span>
              <span className="info-value">PostgreSQL</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Updated</span>
              <span className="info-value">{new Date().toLocaleDateString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
