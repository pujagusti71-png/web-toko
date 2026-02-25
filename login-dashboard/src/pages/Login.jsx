import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (email.trim() === "" || password.trim() === "") {
      setError("Email dan Password tidak boleh kosong!");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Simpan user data ke localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Confirm sebelum masuk dashboard
        const confirm = window.confirm(`Selamat datang ${data.user.name}! Login berhasil. Lanjut ke dashboard?`);
        
        if (confirm) {
          // Redirect berdasarkan role
          if (data.user.role === "admin") {
            navigate("/admin/dashboard", { state: { user: data.user } });
          } else {
            navigate("/dashboard", { state: { user: data.user } });
          }
        }
      } else {
        setError(data.error || "Email atau Password salah!");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login. Pastikan server berjalan.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-icon" style={{ fontSize: '80px' }}>
          👔
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <h1 className="no-select">Toko Pakaian</h1>
          <p className="no-select">Selamat Datang</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
          
          <div className="register-link">
            <p>Belum punya akun? <Link to="/register">Daftar di sini</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
