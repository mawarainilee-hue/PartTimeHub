import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, CartesianGrid, Pie, Cell, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState({});
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    employers: 0,

    totalApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    pendingApplications: 0,

    totalJobs: 0,
    approvedJobs: 0,
    rejectedJobs: 0,
    pendingJobs: 0
  });
  const [topEmployers, setTopEmployers] = useState([]);
  const [topJobs, setTopJobs] = useState([]);

  useEffect(() => {
    if (!userId) {
      toast.error("Please login first");
      navigate("/");
      return;
    }

    loadAdmin();
    loadJobs();
    loadUsers();
    loadStats();
    loadCharts();
  }, [userId, navigate]);

  const loadAdmin = async () => {
    try {
      const res = await axios.get("https://parttimehub.onrender.com/user/" + userId);
      setUser(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error loading admin");
    }
  };

  const loadJobs = async () => {
    try {
      const res = await axios.get("https://parttimehub.onrender.com/pendingJobs");
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error loading jobs");
    }
  };

  const loadUsers = async () => {
    try {
      const res = await axios.get("https://parttimehub.onrender.com/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Error loading users");
    }
  };

  const loadStats = async () => {
    try {
      const res = await axios.get("https://parttimehub.onrender.com/admin/stats");
      setStats({
        totalUsers: res.data.totalUsers || 0,
        students: res.data.students || 0,
        employers: res.data.employers || 0,

        totalApplications: res.data.totalApplications || 0,
        approvedApplications: res.data.approvedApplications || 0,
        rejectedApplications: res.data.rejectedApplications || 0,
        pendingApplications: res.data.pendingApplications || 0,

        totalJobs: res.data.totalJobs || 0,
        approvedJobs: res.data.approvedJobs || 0,
        rejectedJobs: res.data.rejectedJobs || 0,
        pendingJobs: res.data.pendingJobs || 0
      });
    } catch (err) {
      console.error(err);
      toast.error("Error loading statistics");
    }
  };

  const loadCharts = async () => {

      const res = await axios.get(
          "https://parttimehub.onrender.com/admin/chart-data"
      );

      setTopEmployers(res.data.employers);
      setTopJobs(res.data.jobs);

  };

  const updateJobStatus = async (id, status) => {
    try {
      const res = await axios.put("https://parttimehub.onrender.com/jobStatus/" + id, {
        status
      });

      toast.success(res.data.message || "Job status updated");
      loadJobs();
      loadStats();
    } catch (err) {
      console.error(err);
      toast.error("Error updating job status");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      const res = await axios.delete("https://parttimehub.onrender.com/profile/" + id);
      toast.success(res.data.message || "User deleted");
      loadUsers();
      loadStats();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting user");
    }
  };


  const generateReport = () => {
    const report = `
  PartTimeHub Admin Report

  USER STATISTICS
  Total Users: ${stats.totalUsers}
  Students: ${stats.students}
  Employers: ${stats.employers}

  JOB POSTING STATISTICS
  Total Jobs: ${stats.totalJobs}
  Approved Jobs: ${stats.approvedJobs}
  Rejected Jobs: ${stats.rejectedJobs}
  Pending Jobs: ${stats.pendingJobs}

  APPLICATION STATISTICS
  Total Applications: ${stats.totalApplications}
  Approved Applications: ${stats.approvedApplications}
  Rejected Applications: ${stats.rejectedApplications}
  Pending Applications: ${stats.pendingApplications}
  `;

    const blob = new Blob([report], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "admin_report.txt";
    a.click();

    window.URL.revokeObjectURL(url);
  };

    const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const jobChartData = [
    { name: "Approved", value: stats.approvedJobs },
    { name: "Rejected", value: stats.rejectedJobs },
    { name: "Pending", value: stats.pendingJobs }
  ];

  const appChartData = [
    { name: "Approved", value: stats.approvedApplications },
    { name: "Rejected", value: stats.rejectedApplications },
    { name: "Pending", value: stats.pendingApplications }
  ];

  const COLORS = ["#82ca9d", "#f28b8b", "#ffe082"];


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
                  src={user.avatar}
                  alt="avatar"
                  style={styles.avatarImage}
                />
              ) : (
                <div style={styles.avatar}>👤</div>
              )}

              <div>
                <p style={styles.name}>{user.name || "Admin"}</p>
                <p style={styles.email}>{user.email || "-"}</p>
              </div>
            </div>

            <div style={styles.menu}>

              <p
                style={styles.menuItem}
                onClick={() =>
                  document
                    .getElementById("inactive-user-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Manage Users
              </p>
              <p
                style={styles.menuItem}
                onClick={() =>
                  document
                    .getElementById("review-jobs-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Review Jobs
              </p>
              <p
                style={styles.menuItem}
                onClick={() =>
                  document
                    .getElementById("reports-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Reports
              </p>
              <p style={styles.menuItem} onClick={() => navigate("/job-history")}>
                Job History
              </p>
            </div>
          </div>

          <button style={styles.logout} onClick={logout}>
            Log out
          </button>
        </div>

        {/* RIGHT CONTENT */}
        <div style={styles.content}>

          <div style={styles.dashboardGrid}>
            {/* REVIEW JOB POSTING */}
            <div style={styles.card} id="review-jobs-section">
              <h2 style={styles.sectionTitle}>Review Job Posting</h2>

              {jobs.length === 0 ? (
                <p>No jobs found</p>
              ) : (
                jobs.map((job) => (
                  <div key={job._id} style={styles.listBox}>
                    <div style={styles.detailArea}>
                      <p style={styles.detailText}><b>{job.title || "-"}</b></p>
                      <p style={styles.detailText}>{job.location || "-"}</p>
                      <p style={styles.detailText}>Status: {job.status || "-"}</p>
                    </div>

                    <div style={styles.buttonArea}>
                      <button
                        style={styles.approveBtn}
                        onClick={() => updateJobStatus(job._id, "Approved")}
                      >
                        approve
                      </button>

                      <button
                        style={styles.pendingBtn}
                        onClick={() => updateJobStatus(job._id, "Pending")}
                      >
                        pending
                      </button>

                      <button
                        style={styles.rejectBtn}
                        onClick={() => updateJobStatus(job._id, "Rejected")}
                      >
                        reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div style={styles.rightColumn}>
              <div style={styles.card} id="reports-section">
                <h2 style={styles.sectionTitle}>System Activity</h2>

                <div style={styles.activityBox}>
                  <h3 style={styles.smallTitle}>statistics</h3>
                  <p>Total Users: {stats.totalUsers}</p>
                  <p>Students: {stats.students}</p>
                  <p>Employers: {stats.employers}</p>

                  <hr />

                  <p>Total Jobs: {stats.totalJobs}</p>
                  <p>Approved Jobs: {stats.approvedJobs}</p>
                  <p>Rejected Jobs: {stats.rejectedJobs}</p>
                  <p>Pending Jobs: {stats.pendingJobs}</p>

                  <hr />

                  <p>Total Applications: {stats.totalApplications}</p>
                  <p>Approved Applications: {stats.approvedApplications}</p>
                  <p>Rejected Applications: {stats.rejectedApplications}</p>
                  <p>Pending Applications: {stats.pendingApplications}</p>
                </div>


                <div style={styles.chartBox}>
                  <h3 style={styles.smallTitle}>Job Status Chart</h3>

                  <BarChart width={300} height={220} data={jobChartData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#c94f4f" />
                  </BarChart>
                </div>

                <div style={styles.chartBox}>
                  <h3 style={styles.smallTitle}>Application Status Chart</h3>

                  <PieChart width={300} height={240}>
                    <Pie
                      data={appChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {appChartData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>

                <div style={styles.activityBox}>
                  <h3 style={styles.smallTitle}>activity log</h3>
                  <p>• Total users registered: {stats.totalUsers}</p>
                  <p>• Total jobs submitted: {stats.totalJobs}</p>
                  <p>• Pending job approvals: {stats.pendingJobs}</p>
                  <p>
                    • Approved applications: {stats.approvedApplications}
                  </p>
                  <p>
                    • Rejected applications: {stats.rejectedApplications}
                  </p>
                </div>

                <button style={styles.reportBtn} onClick={generateReport}>
                  generate report
                </button>
              </div>
            </div>
            <div style={styles.chartCard}>

            <h2>Top Employers</h2>

            <ResponsiveContainer width="100%" height={300}>

            <BarChart data={topEmployers}>

            <CartesianGrid strokeDasharray="3 3"/>

            <XAxis dataKey="employer"/>

            <YAxis/>

            <Tooltip/>

            <Bar
            dataKey="jobs"
            />

            </BarChart>

            </ResponsiveContainer>

            </div>

            <div style={styles.chartCard}>

            <h2>Top Jobs</h2>

            <ResponsiveContainer width="100%" height={300}>

            <BarChart data={topJobs}>

            <CartesianGrid strokeDasharray="3 3"/>

            <XAxis dataKey="title"/>

            <YAxis/>

            <Tooltip/>

            <Bar
            dataKey="applicants"
            />

            </BarChart>

            </ResponsiveContainer>

            </div>
            {/* INACTIVE USER */}
            <div style={styles.card} id="inactive-user-section">
              <h2 style={styles.sectionTitle}>Manage User</h2>

              {users.length === 0 ? (
                <p>No users found</p>
              ) : (
                users.map((u) => (
                  <div key={u._id} style={styles.listBox}>
                    <div style={styles.detailArea}>
                      <p style={styles.detailText}><b>{u.name || "-"}</b></p>
                      <p style={styles.detailText}>{u.email || "-"}</p>
                      <p style={styles.detailText}>{u.role || "-"}</p>
                    </div>

                    <div style={styles.buttonArea}>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => deleteUser(u._id)}
                      >
                        delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
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
    display: "flex"
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

  email: {
    margin: "4px 0 0 0"
  },

  menu: {
    marginTop: "30px"
  },

  menuItem: {
    cursor: "pointer",
    margin: "14px 0",
    fontWeight: "500",
    fontSize: "16px"
  },

  logout: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: "bold",
    textAlign: "left",
    fontFamily:"serif"
  },

  content: {
    flex: 1,
    padding: "30px"
  },


  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    alignItems: "start"
  },

  rightColumn: {
    gridRow: "span 2"
  },

  card: {
    background: "#f8f3f3",
    borderRadius: "40px",
    padding: "25px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
  },

  sectionTitle: {
    textAlign: "center",
    marginTop: 0,
    marginBottom: "15px",
    fontSize: "24px"
  },

  listBox: {
    background: "#d9d2d2",
    borderRadius: "22px",
    padding: "14px",
    marginBottom: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  detailArea: {
    flex: 1
  },

  detailText: {
    margin: "6px 0",
    fontSize: "15px"
  },

  buttonArea: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginLeft: "10px"
  },

  approveBtn: {
    background: "#a5d6a7",
    border: "none",
    padding: "8px 14px",
    borderRadius: "16px",
    cursor: "pointer"
  },

  pendingBtn: {
    background: "#ffe082",
    border: "none",
    padding: "8px 14px",
    borderRadius: "16px",
    cursor: "pointer"
  },

  rejectBtn: {
    background: "#ef9a9a",
    border: "none",
    padding: "8px 14px",
    borderRadius: "16px",
    cursor: "pointer"
  },

  deleteBtn: {
    background: "#0b0b0b",
    border: "none",
    padding: "8px 14px",
    borderRadius: "12px",
    cursor: "pointer"
  },

  activityBox: {
    background: "#d9d2d2",
    borderRadius: "22px",
    padding: "18px",
    marginBottom: "16px",
    minHeight: "120px"
  },

  smallTitle: {
    textAlign: "center",
    marginTop: 0
  },

  chartCard: {
      background: "#fff",
      padding: "20px",
      borderRadius: "20px",
      marginTop: "25px",
      boxShadow: "0 2px 10px rgba(58, 40, 132, 0.1)"
  },

  reportBtn: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "20px",
    background: "#000000",
    cursor: "pointer",
    fontSize: "18px",
    fontFamily:"serif"
  }
};