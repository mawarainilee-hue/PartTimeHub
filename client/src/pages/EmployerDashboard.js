import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState({});
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [poster, setPoster] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    location: "",
    skillsRequired: "",
    shift: "",
    startTime: "",
    endTime: "",
    workingDays: [],
    workingDate: "",
    category: "",
    maxParticipants: "",
    latitude: "",
    longitude: ""
  });

  useEffect(() => {
    if (!userId) {
      toast.error("Please login first");
      navigate("/");
      return;
    }

    loadUser();
    loadJobs();
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

  const loadJobs = async () => {
    try {
      const res = await axios.get("https://parttimehub.onrender.com/employer-jobs/" + userId);
      setJobs(res.data);  
    } catch (err) {
      console.error(err);
      toast.error("Error loading jobs");
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
      status: status
    });

    toast.success(res.data.message || "Application updated");

    setApplications((prev) =>
      prev.filter((app) => app._id !== id)
    );

  } catch (err) {
    console.error("UPDATE APPLICATION ERROR:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Error updating application");
  }
};

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      const res = await axios.delete("https://parttimehub.onrender.com/job/" + id);
      toast.success(res.data.message || "Job deleted");
      loadJobs();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting job");
    }
  };

  const startEditJob = (job) => {
    setEditingJob(job._id);

    setEditForm({
      title: job.title || "",
      location: job.location || "",
      skillsRequired: job.skillsRequired?.join(", ") || "",
      shift: job.shift || "",
      startTime: job.startTime || "",
      endTime: job.endTime || "",
      workingDays: job.workingDays || [],
      workingDate: job.workingDate || "",
      category: job.category || "",
      maxParticipants: job.maxParticipants || 1,
      latitude: job.latitude || "",
      longitude: job.longitude || ""
    });

    setPoster(null);
  };

  const toggleEditDay = (day) => {
    setEditForm((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const handlePoster = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPoster(file);
  };

  const saveJobUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("title", editForm.title);
      formData.append("location", editForm.location);
      formData.append("shift", editForm.shift);
      formData.append("startTime", editForm.startTime);
      formData.append("endTime", editForm.endTime);
      formData.append("workingDate", editForm.workingDate);
      formData.append("workingDays", JSON.stringify(editForm.workingDays));
      formData.append("category", editForm.category);
      formData.append("maxParticipants", editForm.maxParticipants || 1);
      formData.append("latitude", editForm.latitude || "");
      formData.append("longitude", editForm.longitude || "");

      formData.append(
        "skillsRequired",
        JSON.stringify(
          editForm.skillsRequired
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s !== "")
        )
      );

      if (poster) {
        formData.append("poster", poster);
      }

      const res = await axios.put(
        "https://parttimehub.onrender.com/job/" + editingJob,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      toast.success(res.data.message || "Job updated");
      setEditingJob(null);
      setPoster(null);
      loadJobs();
    } catch (err) {
      console.error(err);
      toast.error("Error updating job");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getStatusStyle = (status) => {
    if (status === "Pending") return { background: "#fff3cd", color: "#856404" };
    if (status === "Approved") return { background: "#d4edda", color: "#155724" };
    if (status === "Rejected") return { background: "#f8d7da", color: "#721c24" };
    return {};
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
                  src={user.avatar}
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
          <h1 style={styles.title}>Welcome, Employer!</h1>

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
                    <p style={styles.detail}><b>Status:</b> {app.status || "-"}</p>
                      <button style={styles.btnn}
                        onClick={() =>
                          navigate(`/student-profile/${app.studentId}`)
                        }
                      >
                        View Profile
                      </button>                  
                      <div style={styles.actions}>
                      <button
                        style={styles.approve}
                        onClick={() => updateStatus(app._id, "Approved")}
                      >
                        approve
                      </button>

                      <button
                        style={styles.reject}
                        onClick={() => updateStatus(app._id, "Rejected")}
                      >
                        reject
                      </button>

  
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={styles.rightPanel}>
              <h2 style={styles.sectionTitle}>Job Listings</h2>

              <div style={styles.jobList}>
                {jobs.length === 0 ? (
                  <p>No jobs yet</p>
                ) : (
                  jobs.map((job) => (
                    <div key={job._id} style={styles.jobCard}>
                      <img
                        src={
                          job.poster  || "/job-placeholder.png"}
                        alt="job"
                        style={styles.poster}
                      />

                      <p style={styles.jobTitle}>{job.title}</p>
                      <p style={styles.jobText}>{job.location}</p>
                      <p style={styles.jobText}>{job.workingHours}</p>

                      <span style={{ ...styles.status, ...getStatusStyle(job.status) }}>
                        {job.status}
                      </span>

                      <div style={styles.jobButtons}>
                        <button
                          style={styles.smallBtn}
                          onClick={() => startEditJob(job)}
                        >
                          Edit
                        </button>

                        <button
                          style={styles.deleteSmallBtn}
                          onClick={() => deleteJob(job._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                style={styles.addJobBtn}
                onClick={() => navigate("/post-job")}
              >
                + Add Job
              </button>

              <button
                style={styles.profileBtn}
                onClick={() => navigate("/profile")}
              >
                Employer Profile
              </button>
            </div>
          </div>

          {editingJob && (
            <div style={styles.modalOverlay}>
              <div style={styles.editBox}>
                <h2>Edit Job</h2>

                <input
                  style={styles.input}
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Job Title"
                />

                <input
                  style={styles.input}
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  placeholder="Location"
                />

                <input
                  style={styles.input}
                  value={editForm.skillsRequired}
                  onChange={(e) =>
                    setEditForm({ ...editForm, skillsRequired: e.target.value })
                  }
                  placeholder="Skills Required (comma separated)"
                />

                <select
                  style={styles.input}
                  value={editForm.shift}
                  onChange={(e) => setEditForm({ ...editForm, shift: e.target.value })}
                >
                  <option value="">Select Shift</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                  <option value="Flexible">Flexible</option>
                </select>

                <input
                  style={styles.input}
                  type="time"
                  value={editForm.startTime}
                  onChange={(e) =>
                    setEditForm({ ...editForm, startTime: e.target.value })
                  }
                />

                <input
                  style={styles.input}
                  type="time"
                  value={editForm.endTime}
                  onChange={(e) =>
                    setEditForm({ ...editForm, endTime: e.target.value })
                  }
                />

                <input
                  style={styles.input}
                  type="date"
                  value={editForm.workingDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, workingDate: e.target.value })
                  }
                />

                <div style={{ marginBottom: "12px" }}>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <label key={day} style={{ marginRight: "10px" }}>
                      <input
                        type="checkbox"
                        checked={editForm.workingDays.includes(day)}
                        onChange={() => toggleEditDay(day)}
                      />
                      {day}
                    </label>
                  ))}
                </div>

                <input
                  style={styles.input}
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  placeholder="Job Category"
                />

                <input
                  style={styles.input}
                  type="number"
                  value={editForm.maxParticipants}
                  onChange={(e) =>
                    setEditForm({ ...editForm, maxParticipants: e.target.value })
                  }
                  placeholder="Maximum Participants"
                />

                <input type="file" onChange={handlePoster} />

                <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                  <button style={styles.addJobBtn} onClick={saveJobUpdate}>
                    Save Update
                  </button>

                  <button style={styles.profileBtn} onClick={() => setEditingJob(null)}>
                    Cancel
                  </button>
                </div>
              </div>
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

  avatar: { fontSize: "30px" },

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

  menu: { marginTop: "30px" },

  menuItem: {
    cursor: "pointer",
    margin: "14px 0",
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

  title: {
    textAlign: "center",
    marginBottom: "40px",
    fontFamily:"Segoe Script",
    fontSize:"40px"
  },

  mainGrid: {
    display: "flex",
    gap: "30px",
    alignItems: "flex-start"
  },

  applicationPanel: {
    background: "#f5eeee",
    borderRadius: "30px",
    padding: "25px",
    width: "420px"
  },

  rightPanel: {
    background: "#f5eeee",
    borderRadius: "30px",
    padding: "25px",
    width: "260px",
    minHeight: "300px"
  },

  sectionTitle: {
    marginTop: 0,
    fontFamily:"serif",
    fontSize:"30px"
  },

  applicationCard: {
    background: "#d9d9d9",
    borderRadius: "20px",
    padding: "16px",
    marginBottom: "16px"
  },

  studentName: {
    fontWeight: "bold",
    fontSize: "17px",
    marginBottom: "10px"
  },

  detail: {
    margin: "6px 0"
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "14px",
    flexWrap: "wrap"
  },

  approve: {
    background: "#a5d6a7",
    border: "none",
    padding: "10px 16px",
    borderRadius: "18px",
    cursor: "pointer"
  },

  pending: {
    background: "#ffe082",
    border: "none",
    padding: "10px 16px",
    borderRadius: "18px",
    cursor: "pointer"
  },

  reject: {
    background: "#db2d2d",
    border: "none",
    padding: "10px 16px",
    borderRadius: "18px",
    cursor: "pointer"
  },

  jobList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "16px"
  },

  jobCard: {
    background: "#fff",
    borderRadius: "18px",
    padding: "12px",
    textAlign: "center"
  },

  poster: {
    width: "90px",
    height: "110px",
    objectFit: "cover",
    borderRadius: "8px"
  },

  jobTitle: {
    fontWeight: "bold",
    margin: "8px 0 4px"
  },

  jobText: {
    margin: "2px 0",
    fontSize: "13px"
  },

  status: {
    display: "inline-block",
    marginTop: "8px",
    padding: "4px 10px",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "12px"
  },

  jobButtons: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    marginTop: "10px"
  },

  smallBtn: {
    background: "#293178",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "10px",
    cursor: "pointer"
  },

  deleteSmallBtn: {
    background: "#8b1e1e",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "10px",
    cursor: "pointer"
  },

  addJobBtn: {
    width: "100%",
    padding: "14px 10px",
    background: "#293178",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    marginBottom: "14px",
    fontWeight: "bold"
  },

  profileBtn: {
    width: "100%",
    padding: "14px 10px",
    background: "#fff",
    color: "#111",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer"
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.45)",

    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",

    overflowY: "auto",
    paddingTop: "40px",
    paddingBottom: "40px",

    zIndex: 9999
  },

  editBox: {
    background: "#f5eeee",
    padding: "25px",
    borderRadius: "25px",

    width: "520px",
    maxWidth: "90%",

    maxHeight: "85vh",
    overflowY: "auto",

    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",

    marginBottom: "40px"
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    boxSizing: "border-box"
  },
  btnn:{
    background:"#454242",
    marginTop:"10px"
  }
};