import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function FindJob() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: ""
  });

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  const [filters, setFilters] = useState({
    skills: "",
    availability: "",
    preference: "",
    shift: "",
    startTime: "",
    endTime: "",
    day: "",
    date: ""
    });

  useEffect(() => {
    if (!userId) {
      toast.error("Please login first");
      navigate("/");
      return;
    }

    loadUser();
    loadJobs();
  }, [userId, navigate]);

  const loadUser = async () => {
    try {
      const res = await axios.get("https://parttimehub.onrender.com/user/" + userId);
      setUser(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error loading user");
    }
  };

  const loadJobs = async () => {
    try {
      const res = await axios.get("https://parttimehub.onrender.com/match/" + userId);
      setJobs(res.data);
      setFilteredJobs(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error loading jobs");
    }
  };

  const getShiftFromTime = (time) => {
  if (!time) return "";

  const hour = Number(time.split(":")[0]);

    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    if (hour >= 17 && hour < 22) return "Evening";
    return "Night";
    };

  const handleSearch = () => {
    // Skills is required
    if (!filters.skills.trim()) {
      toast.warning("Please enter at least one skill.");
      return;
    }

    let result = [...jobs];

    // Required filter (Skills)
    const keyword = filters.skills.toLowerCase();

    result = result.filter((item) =>
      item.job.skillsRequired?.some((skill) =>
        skill.toLowerCase().includes(keyword)
      )
    );

    // Optional filters

    if (filters.preference.trim()) {
      result = result.filter((item) =>
        item.job.category
          ?.toLowerCase()
          .includes(filters.preference.toLowerCase())
      );
    }

    if (filters.shift.trim()) {
      result = result.filter((item) => {
        const jobShift =
          item.job.shift || getShiftFromTime(item.job.startTime);

        return jobShift === filters.shift;
      });
    }

    if (filters.startTime.trim()) {
      result = result.filter(
        (item) => item.job.startTime >= filters.startTime
      );
    }

    if (filters.endTime.trim()) {
      result = result.filter(
        (item) => item.job.endTime <= filters.endTime
      );
    }

    if (filters.day.trim()) {
      result = result.filter((item) =>
        item.job.workingDays?.includes(filters.day)
      );
    }

    if (filters.date.trim()) {
      result = result.filter(
        (item) => item.job.workingDate === filters.date
      );
    }

    setFilteredJobs(result);
  };

  const applyJob = async (jobId) => {
    try {
      await axios.post("https://parttimehub.onrender.com/apply", {
        studentId: userId,
        jobId
      });

      toast.success("Applied successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error applying job");
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
                    src={`https://parttimehub.onrender.com/uploads/${user.avatar}`}
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
          <div style={styles.searchBar}>
            <input
              type="text"
              placeholder="enter skills(required)🔴"
              value={filters.skills}
              onChange={(e) =>
                setFilters({ ...filters, skills: e.target.value })
              }
              style={styles.searchInput}
            />

            <select
                value={filters.shift}
                onChange={(e) => setFilters({ ...filters, shift: e.target.value })}
                style={styles.searchInput}
            >
                <option value="">Shift</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
                <option value="Flexible">Flexible</option>
                </select>

            <input
                type="time"
                value={filters.startTime}
                onChange={(e) => setFilters({ ...filters, startTime: e.target.value })}
                style={styles.searchInput}
            />

            <input
                type="time"
                value={filters.endTime}
                onChange={(e) => setFilters({ ...filters, endTime: e.target.value })}
                style={styles.searchInput}
            />

            <select
                value={filters.day}
                onChange={(e) => setFilters({ ...filters, day: e.target.value })}
                style={styles.searchInput}
            >
                <option value="">Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
            </select>

            <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                style={styles.searchInput}
                />

            <input
              type="text"
              placeholder="Job Preferences (e.g. barista, retail)"
              value={filters.preference}
              onChange={(e) =>
                setFilters({ ...filters, preference: e.target.value })
              }
              style={styles.searchInput}
            />

            <button onClick={handleSearch} style={styles.searchButton}>
              🔎︎
            </button>
          </div>

          <div style={styles.jobGrid}>
            {filteredJobs.length === 0 ? (
              <p style={{ padding: "20px" }}>No jobs found</p>
            ) : (
              filteredJobs.map((item) => (
                <div key={item.job._id} style={styles.jobCard}>
                  <div style={styles.posterSection}>
                    <img
                      src={
                        item.job.poster
                          ? `https://parttimehub.onrender.com/uploads/${item.job.poster}`
                          : "/job-placeholder.png"
                      }
                      alt={item.job.title}
                      style={styles.posterImage}
                    />
                  </div>

                  <div style={styles.infoSection}>
                    <div style={styles.textBlock}>
                      <p style={styles.text}>
                        <b>Title:</b> {item.job.title}
                      </p>
                      <p style={styles.text}>
                        <b>Location:</b> {item.job.location}
                      </p>
                      <p style={styles.text}>
                        <b>Shift:</b> {item.job.shift || getShiftFromTime(item.job.startTime) || "-"}
                      </p>                      
                      <p style={styles.text}><b>Time:</b> {item.job.startTime} - {item.job.endTime}</p>
                      <p style={styles.text}><b>Days:</b> {item.job.workingDays?.join(", ") || "-"}</p>
                      <p style={styles.text}><b>Date:</b> {item.job.workingDate || "-"}</p>
                      <p style={styles.text}>
                        <b>Category:</b> {item.job.category || "-"}
                      </p>
                      <p style={styles.text}>
                        <b>Skills:</b> {item.job.skillsRequired?.join(", ") || "-"}
                      </p>
                      <p style={{ ...styles.text, color: "green", fontWeight: "bold" }}>
                        Match Score: {item.score}
                      </p>
                      <p style={styles.text}>
                        <b>Max Participants:</b> {item.job.maxParticipants || 1}
                      </p>
                      <p style={styles.text}>
                        <b>Applicants:</b> {item.currentApplicants} / {item.job.maxParticipants || 1}
                      </p>
                      <a href={`tel:${item.phoneNumber}`}>
                        📞 Call Company
                      </a>
                      <button
                        style={styles.chatBtn}
                        onClick={() => navigate(`/chat/${item.job.employerId}`)}
                      >
                        💬 Chat Employer
                      </button>
                    </div>

                    <button
                        onClick={() => applyJob(item.job._id)}
                        style={{
                            ...styles.applyBtn,
                            background: item.isFull ? "#ccc" : "#000000",
                            cursor: item.isFull ? "not-allowed" : "pointer"
                        }}
                        disabled={item.isFull}
                        >
                        {item.isFull ? "Full" : "apply"}
                    </button>
                  </div>
                </div>
              ))
            )}
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

  searchBar: {
    width: "99%",
    margin: "10px auto 20px",
    background: "#5159a4",
    borderRadius: "28px",
    padding: "16px 18px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxSizing: "border-box"
  },

  searchInput: {
    flex: 1,
    minWidth: "100px",
    height: "42px",
    border: "none",
    outline: "none",
    borderRadius: "20px",
    padding: "0 16px",
    background: "#fff",
    color: "#333",
    fontSize: "14px",
    boxSizing: "border-box"
  },

  searchButton: {
    width: "42px",
    height: "60px",
    border: "none",
    background: "transparent",
    fontSize: "22px",
    cursor: "pointer",
    flexShrink: 0
  },

  jobGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px"
  },

  jobCard: {
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

  applyBtn: {
    position: "absolute",
    right: "5px",
    bottom: "12px",
    border: "none",
    borderRadius: "18px",
    background: "#000000",
    padding: "5px 18px",
    cursor: "pointer",
    fontSize: "15px",
    width: "30%"
  },
    chatBtn: {
    border: "none",
    background: "#484848",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    marginTop:"20px"
  }
};