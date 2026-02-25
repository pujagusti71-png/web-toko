import { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "./CustomerLayout.css";

function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠", path: "/dashboard" },
    { id: "cart", label: "Keranjang", icon: "🛒", path: "/cart" },
    { id: "orders", label: "Pesanan", icon: "📋", path: "/orders" },
    { id: "profile", label: "Profil", icon: "👤", path: "/profile" }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="customer-layout">
      {/* Sidebar */}
      <div className={`customer-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">👗</span>
            {sidebarOpen && <span className="logo-text">Toko Pakaian</span>}
          </div>
          <p className={`sidebar-subtitle ${!sidebarOpen && "hidden"}`}>Customer</p>
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

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <span className="nav-icon">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="customer-main">
        {/* Top Bar */}
        <div className="customer-topbar">
          <button 
            className="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Sidebar"
          >
            ☰
          </button>
          <h1>Toko Pakaian</h1>
          <div className="topbar-user">
            <span>👤 {user.name || "Customer"}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="customer-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default CustomerLayout;
