import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function Notification() {
  const [notes, setNotes] = useState([]);
  const userId = localStorage.getItem("userId");

  const loadNotes = useCallback(async () => {
    const res = await axios.get(
      "https://parttimehub.onrender.com/notifications/" + userId
    );
    setNotes(res.data);
  }, [userId]); // ✅ dependency

  useEffect(() => {
    loadNotes();

    const interval = setInterval(loadNotes, 3000);
    return () => clearInterval(interval);
  }, [loadNotes]); // ✅ FIXED

  return (
    <div className="card">
      <h3>Notifications</h3>

      {notes.map(n => (
        <div key={n._id}>
          {n.message}
        </div>
      ))}
    </div>
  );
}