import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: ""
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      toast.error("Please login first");
      navigate("/");
      return;
    }

    loadUser();

    const loadApplications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/applications/" + userId
        );
        setApps(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Error loading applications");
      }
    };

    loadApplications();
    const interval = setInterval(loadApplications, 3000);

    return () => clearInterval(interval);
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

  const getStatusStyle = (status) => {
    if (status === "Pending") {
      return { color: "#856404", background: "#fff3cd" };
    } else if (status === "Approved") {
      return { color: "#155724", background: "#d4edda" };
    } else if (status === "Rejected") {
      return { color: "#721c24", background: "#f8d7da" };
    }
    return { color: "#333", background: "#eee" };
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.layout}>
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

        <div style={styles.content}>
          <h1 style={styles.heading}>Application Status</h1>
          <p style={styles.subheading}>
            Track your applied jobs and monitor the latest status updates.
          </p>

          {apps.length === 0 ? (
            <div style={styles.emptyCard}>
              <p>No applications yet</p>
            </div>
          ) : (
            <div style={styles.appGrid}>
              {apps.map((app) => (
                console.log(app),
                <div style={styles.appCard} key={app._id}>
                  <div style={styles.posterSection}>
                    <img
                      src={
                        app.jobId?.poster
                          ? `http://localhost:3000/uploads/${app.jobId.poster}`
                          : "/job-placeholder.png"
                      }
                      alt={app.jobId?.title || "job"}
                      style={styles.posterImage}
                    />
                  </div>

                  <div style={styles.infoSection}>
                    <div style={styles.textBlock}>
                      <p style={styles.text}><b>Title:</b> {app.jobId?.title || "⚠ Job Deleted"}</p>
                      <p style={styles.text}><b>Location:</b> {app.jobId?.location || "-"}</p>
                      <p style={styles.text}><b>Working Hours:</b> {app.jobId?.workingHours || "-"}</p>
                      <p style={styles.text}>
                        <b>Skills:</b> {app.jobId?.skillsRequired?.join(", ") || "-"}
                      </p>
                      <button style={styles.btn}
                        onClick={() =>{
                          console.log("FULL JOB");
                          console.log(app.jobId);
                          
                          navigate(`/chat/${app.jobId.employerId}`);
                        }}
                      >
                        Chat Employer
                      </button>
                    </div>

                    <span
                      style={{
                        ...getStatusStyle(app.status),
                        ...styles.statusBadge
                      }}
                    >
                      {app.status}
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
  heading: {
    margin: "0 0 10px 0",
    fontSize: "40px",
    color: "#111",
    fontFamily:"serif"
  },
  subheading: {
    margin: "0 0 24px 0",
    fontSize: "18px",
    color: "#333",
    fontFamily:"serif"
  },
  emptyCard: {
    background: "#f7f1f1",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
  },
  appGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px"
  },
  appCard: {
    background: "#f7f1f1",
    borderRadius: "35px",
    padding: "18px",
    display: "flex",
    gap: "16px",
    minHeight: "200px",
    alignItems: "center"
  },
  posterSection: {
    width: "30%",
    display: "flex",
    justifyContent: "center"
  },
  posterImage: {
    width: "95px",
    height: "130px",
    objectFit: "cover",
    borderRadius: "5px"
  },
  infoSection: {
    flex: 1,
    background: "#dcd2d2",
    borderRadius: "28px",
    padding: "18px",
    position: "relative",
    minHeight: "150px"
  },
  textBlock: {
    fontSize: "14px",
    color: "#222",
    marginBottom: "36px"
  },
  text: {
    margin: "8px 0"
  },
  statusBadge: {
    position: "absolute",
    right: "18px",
    bottom: "12px",
    padding: "6px 16px",
    borderRadius: "18px",
    fontWeight: "bold",
    fontSize: "14px",
    display: "inline-block"
  },
  btn :{
    background:"#424345"
  }
};