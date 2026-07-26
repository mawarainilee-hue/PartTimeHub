import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const res = await axios.get("https://parttimehub.onrender.com/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Error loading users");
    }
  };

  const deleteUser = async (id) => {
    await axios.delete("https://parttimehub.onrender.com/profile/" + id);
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar role="admin" />

        <div className="container">
          <h2>Manage Users</h2>

          {users.map(u => (
            <div className="card" key={u._id}>
              <h3>{u.name}</h3>
              <p>{u.email}</p>
              <p>{u.role}</p>

              <button onClick={() => deleteUser(u._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}