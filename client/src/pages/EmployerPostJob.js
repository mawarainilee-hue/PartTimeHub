import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function EmployerPostJob() {
  const navigate = useNavigate();
  const employerId = localStorage.getItem("userId");

  const [user, setUser] = useState({});
  const [poster, setPoster] = useState(null);
  const [preview, setPreview] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [job, setJob] = useState({
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
    if (!employerId) {
      toast.error("Please login first");
      navigate("/");
      return;
    }

    loadUser();
  }, [employerId, navigate]);

  const toggleDay = (day) => {
  setJob((prev) => ({
    ...prev,
    workingDays: prev.workingDays.includes(day)
      ? prev.workingDays.filter((d) => d !== day)
      : [...prev.workingDays, day]
  }));
  };

  const detectJobLocation = () => {
  if (!navigator.geolocation) {
    toast.error("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );

        const address = res.data.address || {};

        const place =
          address.city ||
          address.town ||
          address.village ||
          address.state ||
          address.county ||
          "Unknown location";

        setJob((prev) => ({
          ...prev,
          location: place,
          latitude: lat,
          longitude: lon
        }));

        toast.success("Job location detected: " + place);
      } catch (err) {
        console.error(err);

        setJob((prev) => ({
          ...prev,
          location: `${lat}, ${lon}`,
          latitude: lat,
          longitude: lon
        }));

        toast.warning("Using coordinates as job location");
      }
    },
    () => {
      toast.error("Permission denied or failed");
    }
  );
};

  const loadUser = async () => {
    try {
      const res = await axios.get("https://parttimehub.onrender.com/user/" + employerId);
      setUser(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error loading employer");
    }
  };

  const handlePoster = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPoster(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitJob = async () => {
    try {
      const formData = new FormData();

      formData.append("title", job.title);
      formData.append("location", job.location);
      formData.append("shift", job.shift);
      formData.append("startTime", job.startTime);
      formData.append("endTime", job.endTime);
      formData.append("workingDate", job.workingDate);
      formData.append("workingDays", JSON.stringify(job.workingDays));
      formData.append("category", job.category);
      formData.append(
        "skillsRequired",
        JSON.stringify(
          job.skillsRequired
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s !== "")
        )
      );
      formData.append("employerId", employerId);
      formData.append("maxParticipants", job.maxParticipants || 1);
      formData.append("latitude", job.latitude || "");
      formData.append("longitude", job.longitude || "");

      if (poster) {
        formData.append("poster", poster);
      }

      const res = await axios.post("https://parttimehub.onrender.com/job", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success(res.data.message || "Job submitted successfully");

      setJob({
        title: "",
        location: "",
        skillsRequired: "",
        shift: "",
        startTime: "",
        endTime: "",
        workingDays: [],
        workingDate: "",
        category: "",
        phoneNumber,
        maxParticipants: ""
      });
      setPoster(null);
      setPreview("");

      navigate("/employer");
    } catch (err) {
      console.error(err);
      toast.error("Error posting job");
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
        {/* LEFT SIDEBAR */}
        <div style={styles.sidebar}>
          <div>
            <div style={styles.userBox}>
              {user.avatar ? (
                <img
                  src={`https://parttimehub.onrender.com/uploads/${user.avatar}`}
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

        {/* RIGHT CONTENT */}
        <div style={styles.content}>
          <h1 style={styles.title}>Post New Job</h1>

          <div style={styles.formCard}>
            <input
              style={styles.input}
              type="text"
              placeholder="Job Title"
              value={job.title}
              onChange={(e) => setJob({ ...job, title: e.target.value })}
            />

            <input
              style={styles.input}
              type="text"
              placeholder="Location"
              value={job.location}
              onChange={(e) => setJob({ ...job, location: e.target.value })}
            />
            <button
                type="button"
                style={styles.locationBtn}
                onClick={detectJobLocation}
                >
                📍 Use Current Job Location
            </button>

            <input
              style={styles.input}
              type="text"
              placeholder="Skills Required (comma separated)"
              value={job.skillsRequired}
              onChange={(e) =>
                setJob({ ...job, skillsRequired: e.target.value })
              }
            />

            <select
                style={styles.input}
                value={job.shift}
                onChange={(e) => setJob({ ...job, shift: e.target.value })}
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
                value={job.startTime}
                onChange={(e) => setJob({ ...job, startTime: e.target.value })}
            />

            <input
                style={styles.input}
                type="time"
                value={job.endTime}
                onChange={(e) => setJob({ ...job, endTime: e.target.value })}
            />

            <input
                style={styles.input}
                type="date"
                value={job.workingDate}
                onChange={(e) => setJob({ ...job, workingDate: e.target.value })}
            />

            <div>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <label key={day} style={{ marginRight: "10px" }}>
                    <input
                        type="checkbox"
                        checked={job.workingDays.includes(day)}
                        onChange={() => toggleDay(day)}
                    />
                    {day}
                    </label>
                ))}
            </div>
            
            <input
              style={styles.input}
              type="text"
              placeholder="Job Category (e.g. barista, tutor, retail)"
              value={job.category}
              onChange={(e) =>
                setJob({ ...job, category: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Company Phone Number"
              value={phoneNumber}
              onChange={(e)=>setPhoneNumber(e.target.value)}
            />

            <input
              style={styles.input}
              type="number"
              placeholder="Maximum Participants"
              value={job.maxParticipants}
              onChange={(e) =>
                setJob({ ...job, maxParticipants: e.target.value })
              }
            />

            <input
              style={styles.fileInput}
              type="file"
              onChange={handlePoster}
            />


            {preview && (
              <div style={styles.previewWrap}>
                <img src={preview} alt="preview" style={styles.preview} />
              </div>
            )}

            <button style={styles.submitBtn} onClick={submitJob}>
              Submit Job
            </button>
          </div>
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

  menu: {
    marginTop: "30px"
  },

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
    marginBottom: "30px"
  },

  formCard: {
    maxWidth: "500px",
    margin: "0 auto",
    background: "#f5eeee",
    borderRadius: "30px",
    padding: "25px"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    boxSizing: "border-box"
  },

  fileInput: {
    marginTop: "5px",
    marginBottom: "15px"
  },

  previewWrap: {
    marginBottom: "15px",
    textAlign: "center"
  },

  preview: {
    width: "140px",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px"
  },

  submitBtn: {
    width: "100%",
    padding: "14px 10px",
    background: "#293178",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  locationBtn: {
    background: "#f1c27d",
    border: "none",
    padding: "10px 16px",
    borderRadius: "14px",
    cursor: "pointer",
    marginBottom: "12px",
    fontWeight: "bold"
    },
};