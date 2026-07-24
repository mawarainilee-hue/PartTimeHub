import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const hasShownError = useRef(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    skills: [],
    availability: "",
    location: "",
    preferences: "",
    avatar: "",
    company: "",
    contact: ""
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [completion, setCompletion] = useState(0);

  const calculateCompletion = (data) => {
    let total = 5;
    let filled = 0;

    if (data.name) filled++;

    if (data.role === "student") {
      if (data.skills && data.skills.length > 0) filled++;
      if (data.availability) filled++;
      if (data.location) filled++;
      if (data.avatar) filled++;
    } else if (data.role === "employer") {
      if (data.company) filled++;
      if (data.contact) filled++;
      if (data.location) filled++;
      if (data.avatar) filled++;
    }

    return Math.round((filled / total) * 100);
  };

  const loadProfile = async () => {
    try {
      if (!userId) {
        toast.error("Please login first");
        navigate("/");
        return;
      }

      const res = await axios.get("http://localhost:3000/user/" + userId);
      const profileData = res.data;

      setUser(profileData);

      if (profileData.avatar) {
        setPreview("http://localhost:3000/uploads/" + profileData.avatar);
      } else {
        setPreview("https://via.placeholder.com/120");
      }

      setCompletion(calculateCompletion(profileData));
    } catch (err) {
      console.error("PROFILE LOAD ERROR:", err.response?.data || err.message);

      if (!hasShownError.current) {
        toast.error("Error loading profile");
        hasShownError.current = true;
      }
    }
  };

  const detectLocation = () => {
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

          setUser((prev) => ({
            ...prev,
            location: place
          }));

          toast.success("Location detected: " + place);
        } catch (err) {
          console.error(err);

          setUser((prev) => ({
            ...prev,
            location: `${lat}, ${lon}`
          }));

          toast.warning("Using coordinates as location");
        }
      },
      (err) => {
        console.error(err);
        toast.error("Permission denied or failed");
      }
    );
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const updateProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("name", user.name || "");
      formData.append("location", user.location || "");
      formData.append("availability", user.availability || "");
      formData.append("preferences", user.preferences || "");
      formData.append("company", user.company || "");
      formData.append("contact", user.contact || "");
      formData.append("skills", JSON.stringify(user.skills || []));

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const res = await axios.put(
        "http://localhost:3000/profile/" + userId,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      toast.success(res.data.message || "Profile updated successfully");
      await loadProfile();
    } catch (err) {
      console.error("UPDATE PROFILE ERROR:", err.response?.data || err.message);
      toast.error("Error updating profile");
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Delete account?")) return;

    try {
      const res = await axios.delete("http://localhost:3000/profile/" + userId);
      toast.success(res.data.message || "Account deleted");
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error("DELETE PROFILE ERROR:", err.response?.data || err.message);
      toast.error("Error deleting account");
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
                <div style={styles.userName}>{user.name || "User Name"}</div>
                <div style={styles.userEmail}>{user.email || "user@email.com"}</div>
              </div>
            </div>

            <div style={styles.menuSection}>

               {user.role === "admin" && (
                <>
                <p style={styles.menuItem} onClick={() => navigate("/admin")}>
                    Home
                </p>

                </>
              )}

              {user.role === "student" && (
                <>
                <p style={styles.menuItem} onClick={() => navigate("/dashboard")}>
                    Home
                </p>

                  <p style={styles.menuItem} onClick={() => navigate("/find-job")}>
                    Find Job
                  </p>
                  <p style={styles.menuItem} onClick={() => navigate("/applications")}>
                    Applications
                  </p>
                </>
              )}
              {user.role === "employer" && (
                <>
                  <p style={styles.menuItem} onClick={() => navigate("/employer")}>
                    Home
                  </p>
                  <p style={styles.menuItem} onClick={() => navigate("/post-job")}>
                    Post Job</p>
                  <p style={styles.menuItem} onClick={() => navigate("/employer-applications")}>
                    Students Applications
                  </p>
                  <p style={styles.menuItem} onClick={() =>  navigate("/employer-history")}>
                    Application History
                  </p>
                </>
              )}
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
          <h1 style={styles.heading}>My Profile 🌺</h1>

          <div style={styles.progressWrap}>
            <p style={styles.progressText}>Profile Completion: {completion}%</p>
            <div style={styles.progressBarBg}>
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${completion}%`,
                  background: completion === 100 ? "#2e7d32" : "#f9a825"
                }}
              />
            </div>
          </div>

          <div style={styles.grid}>
            {/* PROFILE OVERVIEW */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Profile Overview</h3>

              <div style={styles.profileTop}>
                <img
                  src={preview || "https://via.placeholder.com/120"}
                  alt="avatar"
                  style={styles.largeAvatar}
                />
              </div>

              <div style={styles.detailBlock}>
                <p style={styles.detailText}><b>Name:</b> {user.name || "-"}</p>
                <p style={styles.detailText}><b>Email:</b> {user.email || "-"}</p>
                <p style={styles.detailText}><b>Role:</b> {user.role || "-"}</p>

                {user.role === "student" && (
                  <>
                    <p style={styles.detailText}><b>Skills:</b> {user.skills?.join(", ") || "-"}</p>
                    <p style={styles.detailText}><b>Availability:</b> {user.availability || "-"}</p>
                    <p style={styles.detailText}><b>Location:</b> {user.location || "-"}</p>
                    <p style={styles.detailText}><b>Preferences:</b> {user.preferences || "-"}</p>
                  </>
                )}

                {user.role === "employer" && (
                  <>
                    <p style={styles.detailText}><b>Company:</b> {user.company || "-"}</p>
                    <p style={styles.detailText}><b>Contact:</b> {user.contact || "-"}</p>
                    <p style={styles.detailText}><b>Location:</b> {user.location || "-"}</p>
                  </>
                )}
              </div>
            </div>

            {/* EDIT PROFILE */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Edit Profile</h3>

              <div style={styles.formGroup}>
                <input
                  style={styles.input}
                  value={user.name || ""}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  placeholder="Name"
                />

                <input
                  style={styles.input}
                  value={user.email || ""}
                  disabled
                  placeholder="Email"
                />

                {user.role === "student" && (
                  <>
                    <input
                      style={styles.input}
                      value={user.skills?.join(", ") || ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          skills: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s !== "")
                        })
                      }
                      placeholder="Skills (comma separated)"
                    />

                    <input
                      style={styles.input}
                      value={user.availability || ""}
                      onChange={(e) =>
                        setUser({ ...user, availability: e.target.value })
                      }
                      placeholder="Availability"
                    />

                    <input
                      style={styles.input}
                      value={user.location || ""}
                      onChange={(e) =>
                        setUser({ ...user, location: e.target.value })
                      }
                      placeholder="Location"
                    />
                    <input
                        style={styles.input}
                        value={user.preferences || ""}
                        onChange={(e) =>
                            setUser({ ...user, preferences: e.target.value })
                        }
                        placeholder="Job Preferences (e.g. barista, retail, tutor)"
                    />
                  </>
                )}

                {user.role === "employer" && (
                  <>
                    <input
                      style={styles.input}
                      value={user.company || ""}
                      onChange={(e) =>
                        setUser({ ...user, company: e.target.value })
                      }
                      placeholder="Company"
                    />

                    <input
                      style={styles.input}
                      value={user.contact || ""}
                      onChange={(e) =>
                        setUser({ ...user, contact: e.target.value })
                      }
                      placeholder="Contact"
                    />

                    <input
                      style={styles.input}
                      value={user.location || ""}
                      onChange={(e) =>
                        setUser({ ...user, location: e.target.value })
                      }
                      placeholder="Location"
                    />
                  </>
                )}

                <button
                  type="button"
                  onClick={detectLocation}
                  style={styles.locationBtn}
                >
                  📍 Use Current Location
                </button>

                <input
                  style={styles.fileInput}
                  type="file"
                  onChange={handleImage}
                />

                <div style={styles.buttonRow}>
                  <button style={styles.updateBtn} onClick={updateProfile}>
                    Update Profile
                  </button>

                  <button style={styles.deleteBtn} onClick={deleteAccount}>
                    Delete Account
                  </button>
                </div>
              </div>
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
    margin: "0 0 20px 0",
    fontSize: "40px",
    color: "#111",
    fontFamily:"serif"
  },

  progressWrap: {
    marginBottom: "25px",
    fontFamily:"serif"
  },

  progressText: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "10px",
    fontFamily:"serif"
  },

  progressBarBg: {
    width: "100%",
    height: "12px",
    background: "#ddd",
    borderRadius: "10px"
  },

  progressBarFill: {
    height: "100%",
    borderRadius: "10px",
    transition: "0.3s"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  },

  card: {
    background: "#f7f1f1",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
  },

  cardTitle: {
    margin: "0 0 18px 0",
    fontSize: "28px",
    color: "#111",
    fontFamily:"serif"
  },

  profileTop: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px"
  },

  largeAvatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #fff",
    background: "#fff"
  },

  detailBlock: {
    marginTop: "10px"
  },

  detailText: {
    margin: "10px 0",
    fontSize: "13px",
    color: "#222"
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px",
    boxSizing: "border-box"
  },

  fileInput: {
    marginTop: "4px"
  },

  locationBtn: {
    background: "#f1c27d",
    color: "#111",
    border: "none",
    padding: "10px 16px",
    borderRadius: "18px",
    cursor: "pointer",
    fontWeight: "600",
    width: "fit-content"
  },

  buttonRow: {
    display: "flex",
    gap: "12px",
    marginTop: "10px",
    flexWrap: "wrap"
  },

  updateBtn: {
    background: "#4b4646",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "18px",
    cursor: "pointer",
    fontWeight: "600"
  },

  deleteBtn: {
    background: "#4b4646",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "18px",
    cursor: "pointer",
    fontWeight: "600"
  }
};