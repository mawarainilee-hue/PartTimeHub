import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function EmployerHistory() {

  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);

  const userId =localStorage.getItem("userId");

  const [user, setUser] = useState({});

  useEffect(() => {
    loadHistory();
    loadUser();
  }, []);

  const loadUser = async () => {
  try {
    const res = await axios.get(
      "http://localhost:3000/user/" + userId
    );

    setUser(res.data);
  } catch (err) {
    console.error(err);
  }
    };

  const loadHistory = async () => {

    const res = await axios.get(
      "http://localhost:3000/employer-history/" +
      userId
    );

    setApplications(res.data);
  };

    return (
    <div style={styles.page}>
        <Navbar />

        <div style={styles.layout}>

        {/* SIDEBAR */}
        <div style={styles.sidebar}>

            <div>

            <div style={styles.userBox}>
                {user.avatar ? (
                <img
                    src={`http://localhost:3000/uploads/${user.avatar}`}
                    alt=""
                    style={styles.avatarImage}
                />
                ) : (
                <div style={styles.avatar}>👤</div>
                )}

                <div>
                <p style={styles.name}>
                    {user.name || "Employer"}
                </p>

                <p>{user.email}</p>
                </div>
            </div>

            <div style={styles.menu}>

                <p
                style={styles.menuItem}
                onClick={() => navigate("/employer")}
                >
                Home
                </p>

                <p
                style={styles.menuItem}
                onClick={() => navigate("/post-job")}
                >
                Post Job
                </p>

                <p
                style={styles.menuItem}
                onClick={() => navigate("/employer-applications")}
                >
                Student Applications
                </p>

                <p
                style={styles.menuItem}
                onClick={() => navigate("/employer-history")}
                >
                Application History
                </p>

                <p
                style={styles.menuItem}
                onClick={() => navigate("/profile")}
                >
                Profile
                </p>

            </div>

            </div>

            <button
            style={styles.logout}
            onClick={() => {
                localStorage.clear();
                navigate("/");
            }}
            >
            Log out
            </button>

        </div>

        {/* CONTENT */}
        <div style={styles.content}>

            <h1>Application History</h1>

            {applications.map((app) => (
            <div
                key={app._id}
                style={styles.card}
            >
                <p>
                <b>Name: </b> {app.studentName}
                </p>

                <p>
                <b>Email:</b> {app.studentEmail}
                </p>

                <p>
                <b>Job:</b> {app.jobId?.title}
                </p>

                <p>
                <b>Status:</b> {app.status}
                </p>

                <button style={styles.btn}
                onClick={() =>
                    navigate(
                    `/student-profile/${app.studentId}`
                    )
                }
                >
                View Profile
                </button>
            </div>
            ))}

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
  alignItems: "center",
  marginBottom: "25px"
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

card: {
  background: "#fff",
  padding: "20px",
  borderRadius: "15px",
  marginBottom: "15px"
},
btn:{
    background:"#424141",
    cursor:"pointer",
    right: "5px",
    bottom: "12px",
    border: "none",
    borderRadius: "18px",
    padding: "5px 18px",
    fontSize: "15px",
    width: "30%"
}
};