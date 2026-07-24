import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function NotificationBell() {
  const [notes, setNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const [prevCount, setPrevCount] = useState(0);
  const [shownIds, setShownIds] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    let prevCountLocal = prevCount;

    const loadNotes = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/notifications/" + userId
        );

        const newNotes = res.data;

        // 🔥 DETECT NEW NOTIFICATION
        if (newNotes.length > prevCountLocal) {
          const latest = newNotes[0];

          // ✅ PREVENT DUPLICATE TOAST
          if (!shownIds.includes(latest._id) && !latest.isRead) {
            toast.info(latest.message);
            setShownIds(prev => [...prev, latest._id]);
          }
        }

        prevCountLocal = newNotes.length;
        setPrevCount(newNotes.length);
        setNotes(newNotes);

      } catch (err) {
        console.error(err);
      }
    };

    loadNotes();

    const interval = setInterval(loadNotes, 3000);
    return () => clearInterval(interval);

  }, [userId, shownIds, prevCount]); // ✅ NO WARNING

  const markRead = async (id) => {
    await axios.put(
      "http://localhost:3000/notification/read/" + id
    );

    // refresh after click
    setNotes(prev =>
      prev.map(n =>
        n._id === id ? { ...n, isRead: true } : n
      )
    );
  };

  const unreadCount = notes.filter(n => !n.isRead).length;

  return (
    <div style={{ position: "relative" }}>
      
      {/* 🔔 BELL */}
      <div
        style={{ cursor: "pointer", position: "relative", fontSize: "20px" }}
        onClick={() => setOpen(!open)}
      >
        🔔

        {/* 🔴 BADGE */}
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "-5px",
            right: "-10px",
            background: "red",
            color: "white",
            borderRadius: "50%",
            padding: "3px 7px",
            fontSize: "12px"
          }}>
            {unreadCount}
          </span>
        )}
      </div>

      {/* 📩 DROPDOWN */}
      {open && (
        <div style={{
          position: "absolute",
          right: 0,
          top: "35px",
          width: "300px",
          background: "#fff",
          border: "1px solid #ccc",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          zIndex: 100,
          borderRadius: "8px",
          overflow: "hidden"
        }}>
          <h4 style={{ padding: "10px", margin: 0 }}>
            Notifications
          </h4>

          {notes.length === 0 ? (
            <p style={{ padding: "10px" }}>No notifications</p>
          ) : (
            notes.map(n => (
              <div
                key={n._id}
                onClick={() => markRead(n._id)}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                  background: n.isRead ? "#f9f9f9" : "#0a0a0a",
                  cursor: "pointer",
                  fontWeight: n.isRead ? "normal" : "bold"
                }}
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}