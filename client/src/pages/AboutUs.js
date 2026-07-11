import { useNavigate } from "react-router-dom";

export default function AboutUs() {
  const nav = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <img src="/logo.png" alt="logo" style={styles.navLogo} />

        <div style={styles.navLinks}>
          <span style={styles.navItem} onClick={() => nav("/")}>HOME</span>
          <span style={styles.navItem} onClick={() => nav("/about")}>ABOUT US</span>
          <span style={styles.navItem} onClick={() => nav("/contact")}>CONTACTS</span>
        </div>
      </div>

      <div style={styles.card}>
        <h1>About Us</h1>
        <p>
          PartTimeHub is a student part-time job application system that helps
          students find suitable jobs based on skills, location, availability,
          and job preferences.
        </p>
        <p>
          The system also helps employers post job opportunities and manage
          student applications efficiently.
        </p>
      </div>
    </div>
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
    padding: "0 18px",
    fontFamily: "serif",
    fontWeight: "bold",
    fontSize: "14px",
    borderLeft: "1px solid #ffffff",
    cursor: "pointer",
    color:"white"
  },
  card: {
    width: "600px",
    margin: "90px auto",
    background: "#fff5f5",
    padding: "35px",
    borderRadius: "12px",
    border: "1px solid #333",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
    fontSize: "18px"
  }
};