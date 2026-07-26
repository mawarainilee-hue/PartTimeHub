import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function EmployerApplications() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    if (!userId) {
      toast.error("Please login first");
      navigate("/");
      return;
    }

    loadUser();
    loadApplications();
  }, [userId, navigate]);

  const loadUser = async () => {
    try {
      const res = await axios.get("https://parttimehub.onrender.com/user/" + userId);
      setUser(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error loading employer");
    }
  };

  const loadApplications = async () => {
    try {
      const res = await axios.get(
        "https://parttimehub.onrender.com/employer-applications/" + userId
      );
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error loading applications");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put("https://parttimehub.onrender.com/application/" + id, {
        status
      });

      toast.success(res.data.message || "Application updated");
      loadApplications();
    } catch (err) {
      console.error(err);
      toast.error("Error updating application");
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
        <div style={styles.sidebar}>
          <div>
            <div style={styles.userBox}>
              {user.avatar ? (
                <img
                  src={`https://parttimehub.onrender.com /uploads/${user.avatar}`}
                  alt="avatar"
                  style={styles.avatarImage}
                />
              ) : (
                <div style={styles.avatar}>👤</div>
              )}

              <div>
                <p style={styles.name}>{user.name || "Employer"}</p>
                <p>{user.email || "-"}</p>
              </div>
            </div>

            <div style={styles.menu}>
              <p style={styles.menuItem} onClick={() => navigate("/employer")}>
                Home
              </p>
              <p style={styles.menuItem} onClick={() => navigate("/post-job")}>
                Post Job
              </p>
              <p
                style={styles.menuItem}
                onClick={() => navigate("/employer-applications")}
              >
                Student Applications
              </p>  
              <p style={styles.menuItem} onClick={() =>  navigate("/employer-history")}>
                Application History
              </p>           
              <p style={styles.menuItem} onClick={() => navigate("/profile")}>
                Profile
              </p>

            </div>
          </div>

          <button style={styles.logout} onClick={logout}>
            Log out
          </button>
        </div>

        <div style={styles.content}>

          <div style={styles.mainGrid}>
            <div style={styles.applicationPanel}>
              <h2 style={styles.sectionTitle}>Student Application</h2>

              {applications.length === 0 ? (
                <p>No applications found</p>
              ) : (
                applications.map((app) => (
                  <div key={app._id} style={styles.applicationCard}>
                    <p style={styles.studentName}>{app.studentName || "-"}</p>
                    <p style={styles.detail}><b>Email:</b> {app.studentEmail || "-"}</p>
                    <p style={styles.detail}><b>Job:</b> {app.jobId?.title || "-"}</p>
                    <p style={styles.detail}><b>Location:</b> {app.jobId?.location || "-"}</p>
                    <p style={styles.detail}><b>Status:</b> {app.status || "-"}</p>

                    <div style={styles.actions}>
                      <button
                        style={styles.approve}
                        onClick={() => updateStatus(app._id, "Approved")}
                      >
                        approve
                      </button>

                      <button
                        style={styles.pending}
                        onClick={() => updateStatus(app._id, "Pending")}
                      >
                        pending
                      </button>

                      <button
                        style={styles.reject}
                        onClick={() => updateStatus(app._id, "Rejected")}
                      >
                        reject
                      </button>
                      <button style={styles.btnn}
                        onClick={() =>
                          navigate(`/student-profile/${app.studentId}`)
                        }
                      >
                        View Profile
                      </button>
                    </div>
                    
                  </div>
                ))
              )}
            </div>

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
    gap: "12px",
    alignItems: "center",
    marginBottom: "25px"

  },

  avatar: {
    fontSize: "26px",
    color: "#111"
  },

  avatarImage: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
    background: "#fff"
  },

  name: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "5px"
  },

  menu: {
    marginTop: "10px"
  },

  menuItem: {
    cursor: "pointer",
    margin: "16px 0",
    fontSize: "16px",
    fontWeight: "500"
  },

  logout: {
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


  mainGrid: {
    display: "flex",
    gap: "30px",
    alignItems: "flex-start"
  },

  applicationCard: {
    background: "#f7f1f1",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
  },
    applicationPanel: {
    background: "#acacac",
    borderRadius: "30px",
    padding: "25px",
    width:"100%"
  },
    sectionTitle: {
    marginTop: 0,
    fontFamily:"serif"
  },

    studentName: {
    fontWeight: "bold",
    fontSize: "17px",
    marginBottom: "10px"
  },

  detail: {
    margin: "6px 0"
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

  actions: {
    marginTop: "15px",
    display: "flex",
    gap: "10px"
  },

  approve: {
    background: "#a5d6a7",
    border: "none",
    padding: "8px 14px",
    borderRadius: "10px",
    cursor: "pointer"
  },

  reject: {
    background: "#db2d2d",
    border: "none",
    padding: "8px 14px",
    borderRadius: "10px",
    cursor: "pointer"
  },
    pending: {
    background: "#ffe082",
    border: "none",
    padding: "8px 14px",
    borderRadius: "10px",
    cursor: "pointer"
  },

  btnn:{
    borderRadius: "10px",
    background:"#484040"
  }
};