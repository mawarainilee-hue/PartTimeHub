import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: ""
  });

  const [stats, setStats] = useState({
    totalApplications: 0,
    approved: 0,
    rejected: 0,
    pending: 0
  });

  useEffect(() => {
    if (!userId) {
      toast.error("Please login first");
      navigate("/");
      return;
    }

    loadUser();
    loadApplicationStats();
  }, [userId, navigate]);

  const loadUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/user/" + userId);
      setUser(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error loading user");
    }
  };

  const loadApplicationStats = async () => {
    try {
      const res = await axios.get("http://localhost:3000/applications/" + userId);

      const apps = res.data;
      const approved = apps.filter((a) => a.status === "Approved").length;
      const rejected = apps.filter((a) => a.status === "Rejected").length;
      const pending = apps.filter((a) => a.status === "Pending").length;

      setStats({
        totalApplications: apps.length,
        approved,
        rejected,
        pending
      });
    } catch (err) {
      console.error(err);
      toast.error("Error loading application statistics");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <Navbar />
      

      <div style={styles.layout}>
        {/* LEFT PANEL */}
        <div style={styles.leftPanel}>
          <div>
            <div style={styles.userSection}>
              <div style={styles.avatarWrap}>
                {user.avatar ? (
                  <img
                    src={`http://localhost:3000/uploads/${user.avatar}`}
                    alt="avatar"
                    style={styles.avatarImage}
                  />
                ) : (
                  <div style={styles.avatarFallback}>👤</div>
                )}
              </div>

              <div>
                <div style={styles.userName}>{user.name || "Student Name"}</div>
                <div style={styles.userEmail}>{user.email || "student@email.com"}</div>
              </div>
            </div>

            <div style={styles.menuSection}>
              <p style={styles.menuItem} onClick={() => navigate("/dashboard")}>
                Home
              </p>
              <p style={styles.menuItem} onClick={() => navigate("/find-job")}>
                Find Job
              </p>
              <p style={styles.menuItem} onClick={() => navigate("/applications")}>
                Applications
              </p>
              <p style={styles.menuItem} onClick={() => navigate("/profile")}>
                Profile
              </p>
            </div>
          </div>

          <button style={styles.logoutBtn} onClick={logout}>
            Log out
          </button>
        </div>

        {/* RIGHT CONTENT */}
        <div style={styles.content}>
          <p style={styles.subheading}>Welcome to PartTimeHub 🎓</p>

          <div style={styles.cardGrid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Find Job 🧐💼</h3>
              <p style={styles.cardText}>Search and apply for part-time jobs based on your skills.</p>
              <button
                style={styles.cardButton}
                onClick={() => navigate("/find-job")}
              >
                Go
              </button>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Applications 📋</h3>
              <p style={styles.cardText}>Track your application status in real time.</p>
              <button
                style={styles.cardButton}
                onClick={() => navigate("/applications")}
              >
                View
              </button>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>My Profile 🪪</h3>
              <p style={styles.cardText}>Manage your personal details and improve job matching.</p>
              <button
                style={styles.cardButton}
                onClick={() => navigate("/profile")}
              >
                Edit
              </button>
            </div>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <h3 style={styles.statNumber}>{stats.totalApplications}</h3>
              <p style={styles.statLabel}>Total Applications</p>
            </div>

            <div style={styles.statCard}>
              <h3 style={{ ...styles.statNumber, color: "#2e7d32" }}>{stats.approved}</h3>
              <p style={styles.statLabel}>Approved</p>
            </div>

            <div style={styles.statCard}>
              <h3 style={{ ...styles.statNumber, color: "#f9a825" }}>{stats.pending}</h3>
              <p style={styles.statLabel}>Pending</p>
            </div>

            <div style={styles.statCard}>
              <h3 style={{ ...styles.statNumber, color: "#c62828" }}>{stats.rejected}</h3>
              <p style={styles.statLabel}>Rejected</p>
            </div>
          </div>

          <div style={styles.noticeCard}>
            <h3 style={styles.noticeTitle}>Quick Reminder 📢❗🚨</h3>
            <p style={styles.noticeText}>
              Please complete your profile information to improve job recommendations and matching accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#ead6d6",
    fontFamily: "serif"
  },

  layout: {
    display: "flex",
    minHeight: "calc(100vh - 70px)"
  },

  leftPanel: {
    width: "220px",
    background: "#293178",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px 15px",
    boxSizing: "border-box"
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "25px"
  },

  avatarWrap: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "2px solid #111",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  avatarFallback: {
    fontSize: "26px",
    color: "#111"
  },

  userName: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "5px"
  },

  userEmail: {
    fontSize: "14px"
  },

  menuSection: {
    marginTop: "10px"
  },

  menuItem: {
    cursor: "pointer",
    margin: "16px 0",
    fontSize: "16px",
    fontWeight: "500"
  },

  logoutBtn: {
    background: "transparent",
    border: "none",
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "700",
    cursor: "pointer",
    textAlign: "left",
    fontFamily:"serif"
  },

  content: {
    flex: 1,
    padding: "30px"
  },

  subheading: {
    margin: "0 0 24px 0",
    fontSize: "30px",
    color: "#000000",
    fontFamily:"Segoe Script"
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "25px"
  },

  card: {
    background: "#f7f1f1",
    borderRadius: "28px",
    padding: "24px",
    minHeight: "180px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
  },

  cardTitle: {
    margin: "0 0 12px 0",
    fontSize: "28px",
    color: "#111",
    fontFamily:"serif"
  },

  cardText: {
    margin: "0 0 20px 0",
    fontSize: "13px",
    color: "#333",
    minHeight: "60px",
    fontFamily:"serif"
  },

  cardButton: {
    background: "#293178",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600"
    },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
    marginBottom: "25px"
  },

  statCard: {
    background: "#fff",
    borderRadius: "22px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
  },

  statNumber: {
    margin: "0 0 8px 0",
    fontSize: "34px",
    color: "#111",
    fontFamily:"serif"
  },

  statLabel: {
    margin: 0,
    fontSize: "15px",
    color: "#444",
    fontFamily:"serif"
  },

  noticeCard: {
    background: "#f7f1f1",
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
  },

  noticeTitle: {
    margin: "0 0 10px 0",
    fontSize: "24px",
    color: "#111",
    fontFamily:"serif"
  },

  noticeText: {
    margin: 0,
    fontSize: "15px",
    color: "#333",
    fontFamily:"serif"
  }
};