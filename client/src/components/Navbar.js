import NotificationBell from "./NotificationBell";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.leftSection}>
        <img src="/logo.png" alt="logo" style={styles.logo} />
        <h2 style={styles.brand}>PartTimeHub</h2>
      </div>

      <div style={styles.rightSection}>
        <NotificationBell />
        <button onClick={logout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    background: "#293178",
    color: "white",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border:"2px solid #000000"
  },

  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  logo: {
    width: "45px",
    height: "45px",
    borderRadius: "8px",
    objectFit: "cover",
    background: "#fff"
  },

  brand: {
    margin: 0,
    fontFamily: "Brush Script MT",
    fontSize: "35px",
    color: "#fffcfc"
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },

  logoutBtn: {
    border: "none",
    background: "#fff",
    color: "#111",
    padding: "8px 14px",
    borderRadius: "15px",
    cursor: "pointer",
    fontWeight: "bold",
    fontFamily:"serif"
  }
};