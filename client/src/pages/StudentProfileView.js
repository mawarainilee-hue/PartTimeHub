import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";

export default function StudentProfileView() {

  const { id } = useParams();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const [student, setStudent] = useState({});
  const [user, setUser] = useState({});

  useEffect(() => {
    loadStudent();
    loadEmployer();
  }, []);

  const loadStudent = async () => {
    try {
      const res = await axios.get(
        `https://parttimehub.onrender.com/student-profile/${id}`
      );

      setStudent(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  const loadEmployer = async () => {
    try {
      const res = await axios.get(
        `https://parttimehub.onrender.com/user/${userId}`
      );

      setUser(res.data);

    } catch (err) {
      console.error(err);
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

        {/* Sidebar */}

        <div style={styles.sidebar}>

          <div>

            <div style={styles.userBox}>
              {user.avatar ? (
                <img
                  src={`https://parttimehub.onrender.com/uploads/${user.avatar}`}
                  alt=""
                  style={styles.avatarImage}
                />
              ) : (
                <div style={styles.avatar}>👤</div>
              )}

              <div>
                <p style={styles.name}>
                  {user.name}
                </p>

                <p>
                  {user.email}
                </p>
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
                onClick={() =>
                  navigate("/employer-applications")
                }
              >
                Student Applications
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
            onClick={logout}
          >
            Log out
          </button>

        </div>

        {/* Content */}

        <div style={styles.content}>

          <h1 style={styles.title}>
            Student Profile
          </h1>

          <div style={styles.card}>

            {student.avatar && (
              <img
                src={`https://parttimehub.onrender.com/uploads/${student.avatar}`}
                alt=""
                style={styles.studentAvatar}
              />
            )}

            <p><b>Name:</b> {student.name}</p>
            <p><b>Email:</b> {student.email}</p>
            <p><b>Location:</b> {student.location}</p>
            <p><b>Availability:</b> {student.availability}</p>
            <p><b>Preferences:</b> {student.preferences}</p>

            <p>
              <b>Skills:</b>
              {" "}
              {student.skills?.join(", ")}
            </p>

            <button
              style={styles.chatButton}
              onClick={() =>
                navigate(`/chat/${student._id}`)
              }
            >
              Chat Student
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

const styles = {
  page:{
    minHeight:"100vh",
    background:"#ead6d6",
    fontFamily: "serif"
  },

  layout:{
    display:"flex",
    minHeight: "calc(100vh - 70px)"
  },

  sidebar:{
    width:"220px",
    background:"#293178",
    color:"#ffffff",
    display:"flex",
    flexDirection:"column",
    justifyContent:"space-between",
    padding:"20px"
  },

  userBox:{
    display:"flex",
    gap:"10px",
    alignItems:"center",
    marginBottom: "25px"
  },

  avatar:{
    fontSize:"28px",
    color: "#111"
  },

  avatarImage:{
    width:"50px",
    height:"50px",
    borderRadius:"50%",
    objectFit: "cover",
    background: "#fff"
  },

  name:{
    fontSize: "20px", 
    fontWeight: "600", 
    marginBottom: "5px"
  },

  menu:{
    marginTop:"10px"
  },

  menuItem:{
    margin:"16px 0",
    cursor:"pointer",
    fontSize:"16px",
    fontWeight:"500"
  },

  logout:{
    background: "transparent", 
    border: "none", 
    color: "#ffffff", 
    fontSize: "20px", 
    fontWeight: "700", 
    cursor: "pointer", 
    textAlign: "left",
    fontFamily:"serif"
  },

  content:{
    flex:1,
    padding:"30px"
  },

  title:{
    textAlign:"center",
    marginBottom: "30px"
  },

  card:{
    background: "#f7f1f1", 
    borderRadius: "28px", 
    padding: "24px", 
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
  },

  studentAvatar:{
    width:"120px",
    height:"120px",
    borderRadius:"50%",
    display:"block",
    margin:"0 auto 20px"
  },

  chatButton:{
    width:"100%",
    marginTop:"20px",
    padding:"12px",
    border:"none",
    background:"#293178",
    color:"#fff",
    borderRadius:"10px",
    cursor:"pointer"
  }
};