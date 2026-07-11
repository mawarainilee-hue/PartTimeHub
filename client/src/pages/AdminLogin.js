import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginAdmin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/login", {
        email,
        password
      });

      alert(res.data.message);

      if (res.data.userId && res.data.role === "admin") {
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("role", res.data.role);
        nav("/admin");
      } else {
        alert("Unauthorized admin access");
      }
    } catch (err) {
      console.error(err);
      alert("Admin login error");
    }
  };

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

      <div style={styles.topText}>
        <p style={styles.welcome}>ADMIN</p>
        <h1 style={styles.brand}>PartTimeHub</h1>
      </div>

      <div style={styles.formBox}>

        <div style={styles.formContent}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            value={email}
            placeholder="Please enter"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            placeholder="Please enter"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.submitBtn} onClick={loginAdmin}>
            submit
          </button>
        </div>
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

  topText: {
    textAlign: "center",
    marginTop: "35px"
  },

  welcome: {
    fontSize: "32px",
    margin: 0,
    color:"#fff"
  },

  brand: {
    fontSize: "46px",
    fontFamily: "Brush Script MT",
    fontWeight: "normal",
    margin: "10px 0 30px",
    color:"#fff"
  },

  formBox: {
    width: "360px",
    minHeight: "300px",
    background: "#fff5f5",
    border: "1px solid #333",
    margin: "0 auto",
    padding: "20px 35px",
    boxSizing: "border-box",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
  },

  title: {
    textAlign: "center",
    fontSize: "34px",
    marginTop: 0,
    marginBottom: "45px"
  },

  formContent: {
    width: "240px",
    margin: "0 auto"
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontFamily: "serif",
    marginTop: "10px",
    marginBottom: "4px"
  },

  input: {
    width: "100%",
    height: "28px",
    borderRadius: "6px",
    border: "1px solid #333",
    padding: "0 8px",
    boxSizing: "border-box",
    fontSize: "14px"
  },

  submitBtn: {
    marginTop: "45px",
    width: "100%",
    height: "38px",
    borderRadius: "20px",
    border: "1px solid #333",
    background: "#293178",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
    fontFamily: "Georgia, serif",
    cursor: "pointer",
    padding:"4px"
  }
};