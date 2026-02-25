import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    address: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.passwordConfirm) {
      setError("Nama, email, dan password tidak boleh kosong");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return false;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("Password dan konfirmasi password tidak cocok");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email tidak valid");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || "",
          address: formData.address || ""
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registrasi gagal");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setError("");
      
      // Confirm registrasi berhasil
      const confirm = window.confirm("✅ Registrasi berhasil! Apakah Anda ingin login sekarang?");
      
      if (confirm) {
        // Redirect ke login setelah 2 detik
        setTimeout(() => {
          navigate("/", { state: { message: "Registrasi berhasil! Silakan login." } });
        }, 2000);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat registrasi");
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-icon">👕</div>
          <h1>Daftar Akun</h1>
          <p>Bergabunglah dengan Toko Pakaian kami</p>
        </div>

        {success && (
          <div className="success-message">
            ✓ Registrasi berhasil! Mengarahkan ke login...
          </div>
        )}

        {error && (
          <div className="error-message">
            ✕ {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Nama Lengkap *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap Anda"
              disabled={loading || success}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email Anda"
              disabled={loading || success}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
              disabled={loading || success}
            />
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirm">Konfirmasi Password *</label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="Ulangi password Anda"
              disabled={loading || success}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Nomor Telepon (Opsional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="08xx xxxx xxxx"
              disabled={loading || success}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Alamat (Opsional)</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Masukkan alamat Anda"
              rows="3"
              disabled={loading || success}
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="register-btn"
            disabled={loading || success}
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <div className="register-footer">
          <p>Sudah punya akun? <Link to="/">Login di sini</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
