import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function JobHistory() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [admin, setAdmin] = useState({});
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!userId) {
      toast.error("Please login first");
      navigate("/");
      return;
    }

    loadAdmin();
    loadHistory();
  }, [userId, navigate]);

  const loadAdmin = async () => {
    try {
      const res = await axios.get("http://localhost:3000/user/" + userId);
      setAdmin(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await axios.get("http://localhost:3000/jobHistory");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error loading job history");
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Approved") return { background: "#d4edda", color: "#155724" };
    if (status === "Rejected") return { background: "#f8d7da", color: "#721c24" };
    return { background: "#fff3cd", color: "#856404" };
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.layout}>
        <div style={styles.sidebar}>
          <div>
            <div style={styles.userBox}>
              {admin.avatar ? (
                <img
                  src={`http://localhost:3000/uploads/${admin.avatar}`}
                  alt="avatar"
                  style={styles.avatarImage}
                />
              ) : (
                <div style={styles.avatar}>👤</div>
              )}

              <div>
                <p style={styles.name}>{admin.name || "Admin"}</p>
                <p style={styles.email}>{admin.email || "-"}</p>
              </div>
            </div>

            <div style={styles.menu}>
              <p style={styles.menuItem} onClick={() => navigate("/admin")}>
                Home
              </p>
            </div>
          </div>

          <button style={styles.logout} onClick={logout}>
            Log out
          </button>
        </div>

        <div style={styles.content}>
          <h1 style={styles.title}>Job Posting History</h1>

          {jobs.length === 0 ? (
            <div style={styles.card}>No job history found</div>
          ) : (
            <div style={styles.grid}>
              {jobs.map((job) => (
                <div key={job._id} style={styles.card}>
                  <img
                    src={
                      job.poster
                        ? `http://localhost:3000/uploads/${job.poster}`
                        : "/job-placeholder.png"
                    }
                    alt="poster"
                    style={styles.poster}
                  />

                  <div style={styles.info}>
                    <h3>{job.title || "-"}</h3>
                    <p><b>Location:</b> {job.location || "-"}</p>
                    <p><b>Category:</b> {job.category || "-"}</p>
                    <p><b>Shift:</b> {job.shift || "-"}</p>
                    <p><b>Time:</b> {job.startTime || "-"} - {job.endTime || "-"}</p>
                    <p><b>Date:</b> {job.workingDate || "-"}</p>
                    <p><b>Participants:</b> {job.maxParticipants || 1}</p>

                    <span style={{ ...styles.status, ...getStatusStyle(job.status) }}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#ead6d6",
    minHeight: "100vh",
    fontFamily: "serif"
  },

  layout: {
    display: "flex"
  },

  sidebar: {
    width: "220px",
    background: "#293178",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px"
  },

  userBox: {
    display: "flex",
    gap: "10px",
    alignItems: "center"
  },

  avatar: {
    fontSize: "30px"
  },

  avatarImage: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
    background: "#fff"
  },

  name: {
    fontWeight: "bold",
    margin: 0
  },

  email: {
    margin: "4px 0 0 0"
  },

  menu: {
    marginTop: "30px"
  },

  menuItem: {
    cursor: "pointer",
    margin: "14px 0",
    fontWeight: "500"
  },

  logout: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: "bold",
    textAlign: "left",
    fontFamily:"serif"
  },

  content: {
    flex: 1,
    padding: "30px"
  },

  title: {
    textAlign: "center",
    fontSize: "42px",
    marginBottom: "25px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px"
  },

  card: {
    background: "#f8f3f3",
    borderRadius: "28px",
    padding: "18px",
    display: "flex",
    gap: "18px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
  },

  poster: {
    width: "100px",
    height: "130px",
    objectFit: "cover",
    borderRadius: "10px"
  },

  info: {
    flex: 1
  },

  status: {
    display: "inline-block",
    marginTop: "8px",
    padding: "6px 14px",
    borderRadius: "14px",
    fontWeight: "bold"
  }
};