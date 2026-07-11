import { useNavigate } from "react-router-dom";

export default function Landing() {
  const nav = useNavigate();

  return (
    <div style={styles.page}>
      {/* 🔴 NAVBAR */}
      <div style={styles.navbar}>
        <img src="/logo.png" alt="logo" style={styles.navLogo} />

        <div style={styles.navLinks}>
          <span style={styles.navItem} onClick={() => nav("/about")}>ABOUT US</span>
          <span style={styles.navItem} onClick={() => nav("/contact")}>CONTACTS</span>
        </div>
      </div>

      {/* 🔥 HERO SECTION */}
      <div style={styles.formBox}>
      <div style={styles.hero}>
        <img src="/logo.png" alt="PartTimeHub logo" style={styles.mainLogo} />

        <h1 style={styles.brand}>PartTimeHub</h1>
        <p style={styles.subtitle}>Specially Made For Students</p>

        {/* 🔘 BUTTONS */}
        <div style={styles.buttonRow}>
          <button style={styles.smallBtn} onClick={() => nav("/login")}>
            login
          </button>

          <button style={styles.smallBtn} onClick={() => nav("/register")}>
            register
          </button>
        </div>

        {/* 🛡️ ADMIN BUTTON */}
        <div style={{ marginTop: "20px" }}>
          <button
            style={styles.adminBtn}
            onClick={() => nav("/admin-login")}
          >
            admin login
          </button>
        </div>
      </div>
    </div></div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundImage: "url('/star.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontFamily: "Georgia, serif"
  },

  navbar: {
    height: "55px",
    background: "#293178",
    border: "1px solid #333",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 10px"
  },

  navLogo: {
    width: "45px",
    height: "45px",
    borderRadius: "8px",
    background: "#fff",
    objectFit: "cover"
  },

  navLinks: {
    display: "flex",
    height: "100%",
    alignItems: "center"
  },

  navItem: {
    padding: "0 20px",
    fontFamily: "serif",
    fontWeight: "bold",
    fontSize: "14px",
    borderLeft: "1px solid #ffffff",
    cursor: "pointer",
    color:"white"
  },

  hero: {
    textAlign: "center",
    paddingTop: "35px"
  },

  mainLogo: {
    width: "155px",
    height: "155px",
    borderRadius: "50%",
    objectFit: "cover"
  },

  brand: {
    fontSize: "45px",
    fontFamily: "Brush Script MT",
    fontWeight: "lighter",
    fontStyle:"oblique",
    margin: "12px 0 5px"
  },

  subtitle: {
    fontSize: "26px",
    marginBottom: "50px",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "30px"
  },

  smallBtn: {
    border: "1px solid #333",
    borderRadius: "50px",
    padding: "5px 20px",
    fontSize: "15px",
    fontWeight: "bold",
    fontFamily: "Georgia, serif",
    cursor: "pointer",
    background:"#293178"
  },
  formBox: {
    width: "500px",
    minHeight: "300px",
    background: "#fff5f5",
    border: "1px solid #333",
    margin: "0 auto",
    marginTop:"60px",
    padding: "25px 35px",
    boxSizing: "border-box",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
  },

  adminBtn: {
    background: "#000000",
    border: "1px solid #333",
    borderRadius: "20px",
    padding: "5px 18px",
    fontSize: "15px",
    fontWeight: "bold",
    fontFamily: "Georgia, serif",
    cursor: "pointer"
  }
};