import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (!user.id) {
        navigate("/");
        return;
      }

      setProfile(user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || ""
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading profile:", error);
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

  const handleSaveProfile = async () => {
    try {
      // Update ke API
      const response = await fetch(`http://localhost:5000/api/users/${profile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Update localStorage
        const updatedUser = {
          ...profile,
          name: formData.name,
          phone: formData.phone,
          address: formData.address
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setProfile(updatedUser);
        setIsEditing(false);
        alert("Profil berhasil diperbarui!");
      } else {
        alert("Gagal memperbarui profil: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Terjadi kesalahan saat memperbarui profil");
    }
  };

  if (loading) {
    return <div className="loading">Memuat profil...</div>;
  }

  if (!profile) {
    return <div className="error">Profil tidak ditemukan</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>👤 Profil Saya</h1>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          {!isEditing ? (
            // View Mode
            <>
              <div className="profile-section">
                <h2>Informasi Akun</h2>
                <div className="profile-info">
                  <div className="info-row">
                    <label>Nama Lengkap:</label>
                    <p>{profile.name}</p>
                  </div>
                  <div className="info-row">
                    <label>Email:</label>
                    <p>{profile.email}</p>
                  </div>
                  <div className="info-row">
                    <label>Nomor Telepon:</label>
                    <p>{profile.phone || "Belum diisi"}</p>
                  </div>
                  <div className="info-row">
                    <label>Alamat:</label>
                    <p>{profile.address || "Belum diisi"}</p>
                  </div>
                </div>
              </div>

              <div className="profile-footer">
                <button 
                  className="btn-edit"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit Profil
                </button>
              </div>
            </>
          ) : (
            // Edit Mode
            <>
              <div className="profile-section">
                <h2>Edit Profil</h2>
                <div className="form-group">
                  <label>Nama Lengkap:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div className="form-group">
                  <label>Email (Tidak dapat diubah):</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group">
                  <label>Nomor Telepon:</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Masukkan nomor telepon"
                  />
                </div>

                <div className="form-group">
                  <label>Alamat:</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Masukkan alamat lengkap"
                    rows="4"
                  />
                </div>
              </div>

              <div className="profile-footer">
                <button 
                  className="btn-cancel"
                  onClick={() => {
                    setIsEditing(false);
                    loadProfile();
                  }}
                >
                  ❌ Batal
                </button>
                <button 
                  className="btn-save"
                  onClick={handleSaveProfile}
                >
                  💾 Simpan Perubahan
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
