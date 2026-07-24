import { useNavigate } from "react-router-dom";

export default function Sidebar({ role }) {
  const nav = useNavigate();

  return (
    <div style={styles.sidebar}>
      <h3 style={styles.role}>{role}</h3>

      {role === "student" && (
        <>
          <p style={styles.link} onClick={() => nav("/dashboard")}>Home</p>
          <p style={styles.link} onClick={() => nav("/find-job")}>Find Job</p>
          <p style={styles.link} onClick={() => nav("/applications")}>Applications</p>
          <p style={styles.link} onClick={() => nav("/profile")}>Profile</p>
        </>
      )}

      {role === "employer" && (
        <>
          <p style={styles.link} onClick={() => nav("/employer")}>Dashboard</p>
          <p style={styles.link} onClick={() => nav("/applications")}>Applications</p>
          <p style={styles.link} onClick={() => nav("/profile")}>Profile</p>
        </>
      )}

      {role === "admin" && (
        <>
          <p style={styles.link} onClick={() => nav("/admin")}>Dashboard</p>
          <p style={styles.link} onClick={() => nav("/admin-users")}>Users</p>
          <p style={styles.link} onClick={() => nav("/profile")}>Profile</p>
        </>
      )}
    </div>
  );
}

const styles = {
  sidebar: {
    width: "180px",
    minHeight: "calc(100vh - 65px)",
    background: "#d98d8d",
    color: "white",
    padding: "20px 15px",
    boxSizing: "border-box",
    border:"2px solid #000000"
  },

  role: {
    textTransform: "lowercase",
    marginBottom: "25px"
  },

  link: {
    cursor: "pointer",
    margin: "18px 0",
    fontSize: "16px"
  }
};