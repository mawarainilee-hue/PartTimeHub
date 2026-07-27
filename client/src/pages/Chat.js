import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";

export default function Chat() {

  const navigate = useNavigate();

  const { otherUserId } = useParams();

  const userId =
    localStorage.getItem("userId");

  const [user, setUser] = useState({});
  const [role, setRole] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("otherUserId =", otherUserId);
    console.log("Current User:", userId);
    console.log("Other User:", otherUserId);

    loadUser();
    loadMessages();

  }, []);

  const loadUser = async () => {

    const res = await axios.get(
      "https://parttimehub.onrender.com/user/" + userId
    );

    setUser(res.data);
    setRole(res.data.role);
    console.log("ROLE =", res.data.role);
  };

const loadMessages = async () => {
  try {

    console.log("User ID:", userId);
    console.log("Other User ID:", otherUserId);

    const res = await axios.get(
      `https://parttimehub.onrender.com/messages/${userId}/${otherUserId}`
    );

    setMessages(res.data);

  } catch (err) {

    console.error("LOAD MESSAGE ERROR");
    console.error(err);
    console.error(err.response?.data);

  }
};

  const sendMessage = async () => {

    if (!message.trim()) return;

    await axios.post(
      "https://parttimehub.onrender.com/send-message",
      {
        senderId: userId,
        receiverId: otherUserId,
        message
      }
    );

    setMessage("");

    loadMessages();
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
                  src={`https://parttimehub.onrender.com/uploads/${user.avatar}`}
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

            {role === "student" ? (
                <>
                <p
                    style={styles.menuItem}
                    onClick={() => navigate("/dashboard")}
                >
                    Home
                </p>

                <p
                    style={styles.menuItem}
                    onClick={() => navigate("/find-job")}
                >
                    Find Job
                </p>

                <p
                    style={styles.menuItem}
                    onClick={() => navigate("/applications")}
                >
                    Applications
                </p>

                <p
                    style={styles.menuItem}
                    onClick={() => navigate("/profile")}
                >
                    Profile
                </p>
                </>
            ) : (
                <>
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
                    onClick={() => navigate("/profile")}
                >
                    Profile
                </p>
                </>
            )}

            </div>

          </div>

          <button
            style={styles.logout}
            onClick={logout}
          >
            Log out
          </button>

        </div>

        <div style={styles.content}>

          <h1 style={styles.title}>
            Chat
          </h1>

          <div style={styles.chatBox}>

            {messages.map((msg) => (

              <div
                key={msg._id}
                style={{
                  textAlign:
                    msg.senderId === userId
                      ? "right"
                      : "left",
                  marginBottom:"10px"
                }}
              >
                <span style={styles.bubble}>
                  {msg.message}
                </span>
              </div>

            ))}

          </div>

          <div style={styles.inputArea}>

            <input
              style={styles.input}
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
            />

            <button
              style={styles.sendBtn}
              onClick={sendMessage}
            >
              Send
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

  chatBox:{
    background:"#fff",
    height:"500px",
    overflowY:"auto",
    borderRadius:"20px",
    padding:"20px"
  },
  bubble:{
    background:"#d9d2d2",
    padding:"10px",
    borderRadius:"10px",
    display:"inline-block"
  },
  inputArea:{
    display:"flex",
    marginTop:"15px",
    gap:"10px"
  },
  input:{
    flex:1,
    padding:"12px"
  },
  sendBtn:{
    width:"120px",
    border:"none",
    background:"#293178",
    color:"#fff",
    borderRadius:"10px",
    cursor:"pointer"
  }
};