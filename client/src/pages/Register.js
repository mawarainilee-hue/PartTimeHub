import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });

  const register = async () => {
    try {
      const res = await axios.post("https://parttimehub.onrender.com/register", form);
      alert(res.data.message || "Registered");
      nav("/");
    } catch (err) {
      console.error(err);
      alert("Register error");
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
        <p style={styles.welcome}>Welcome to</p>
        <h1 style={styles.brand}>PartTimeHub</h1>
      </div>

      <div style={styles.formBox}>

        <div style={styles.formContent}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            value={form.name}
            placeholder="Please enter"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            value={form.email}
            placeholder="Please enter"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={form.password}
            placeholder="Please enter"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <label style={styles.label}>Role</label>
          <select
            style={styles.input}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="employer">Employer</option>
          </select>

          <button style={styles.submitBtn} onClick={register}>
            register
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
    fontSize: "28px",
    margin: 0,
    color:"#fff"
  },

  brand: {
    fontSize: "40px",
    fontFamily: "Brush Script MT",
    fontWeight: "normal",
    margin: "10px 0 25px",
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
    marginBottom: "55px"
  },

  formContent: {
    width: "240px",
    margin: "0 auto"
  },

  label: {
    display: "block",
    fontSize: "11px",
    fontFamily: "serif",
    marginTop: "6px"
  },

  input: {
    width: "100%",
    height: "22px",
    borderRadius: "4px",
    border: "1px solid #333",
    padding: "0 6px",
    boxSizing: "border-box"
  },

  submitBtn: {
    marginTop: "55px",
    width: "100%",
    height: "40px",
    padding:"4px",
    borderRadius: "16px",
    border: "1px solid #333",
    fontSize: "16px",
    fontWeight: "bold",
    fontFamily: "Georgia, serif",
    cursor: "pointer",
    background:"#293178"
  }
};