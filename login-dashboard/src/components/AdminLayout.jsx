import { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/admin/dashboard" },
    { id: "orders", label: "Pesanan", icon: "📦", path: "/admin/orders" },
    { id: "customers", label: "Pelanggan", icon: "👥", path: "/admin/customers" },
    { id: "settings", label: "Pengaturan", icon: "⚙️", path: "/admin/settings" }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">👕</span>
            {sidebarOpen && <span className="logo-text">Toko Baju</span>}
          </div>
          <p className={`sidebar-subtitle ${!sidebarOpen && "hidden"}`}>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <button className="nav-item logout-btn" onClick={handleLogout} title="Logout">
          <span className="nav-icon">🚪</span>
          {sidebarOpen && <span className="nav-label">Logout</span>}
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <button 
            className="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
          >
            ☰
          </button>
          <div className="header-title">
            {menuItems.find(item => isActive(item.path))?.label || "Admin"}
          </div>
          <div className="header-user">
            <span className="user-icon">👤</span>
            <span className="user-name">{user.name || "Admin"}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
