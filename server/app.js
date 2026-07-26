const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const app = express();
const bcrypt = require("bcryptjs");

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// storage config
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});



const Application = require("./models/Application");
const User = require("./models/user");
const Job = require("./models/Job");
const Notification = require("./models/Notification");
const Message = require("./models/Message");

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
    res.send("PartTimeHub API Running");
});

// Run server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



// Register student
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }


    const newUser = new User({
      name,
      email: email.toLowerCase().trim(),
      password,
      role,
      skills: [],
      availability: "",
      location: "",
      company: "",
      contact: "",
      avatar: "",
      preferences: ""
    });

    await newUser.save();

    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Error saving user" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let isMatch = false;

    // hashed password
    if (user.password && user.password.startsWith("$2")) {
      isMatch = await bcrypt.compare(password, user.password);
    } 
    // old plain password
    else {
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.json({
      message: "Login successful",
      userId: user._id,
      role: user.role
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login error" });
  }
});

app.get("/match/:studentId", async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);
    const jobs = await Job.find({ status: "Approved" });

    let matchedJobs = [];

    for (const job of jobs) {
      let score = 0;

      const currentApplicants = await Application.countDocuments({
        jobId: job._id
      });

      // Rule 1: Skill match
      job.skillsRequired.forEach((skill) => {
        if (
          student.skills?.some(
            (s) => s.toLowerCase() === skill.toLowerCase()
          )
        ) {
          score += 1;
        }
      });

      // Rule 2: Exact location match
      if (
        student.location &&
        job.location &&
        student.location.toLowerCase() === job.location.toLowerCase()
      ) {
        score += 1;
      }

      // Rule 3: Partial location match
      else if (
        student.location &&
        job.location &&
        job.location.toLowerCase().includes(student.location.toLowerCase())
      ) {
        score += 1;
      }

      // Rule 4: Shift match
      if (
        student.availability &&
        job.shift &&
        student.availability.toLowerCase() === job.shift.toLowerCase()
      ) {
        score += 1;
      }

      // Rule 5: Preference/category match
      if (
        student.preferences &&
        job.category &&
        student.preferences.toLowerCase().includes(job.category.toLowerCase())
      ) {
        score += 2;
      }

      // Rule 6: Available day match
      if (
        student.availableDay &&
        job.workingDays?.includes(student.availableDay)
      ) {
        score += 1;
      }

      // Rule 7: Available date match
      if (
        student.availableDate &&
        job.workingDate &&
        student.availableDate === job.workingDate
      ) {
        score += 1;
      }

      // Rule 8: Time range match
      if (
        student.startTime &&
        student.endTime &&
        job.startTime &&
        job.endTime &&
        student.startTime >= job.startTime &&
        student.endTime <= job.endTime
      ) {
        score += 2;
      }

      // Rule 9: Capacity available
      if (currentApplicants < (job.maxParticipants || 1)) {
        score += 1;
      }

      matchedJobs.push({
        job,
        score,
        currentApplicants,
        isFull: currentApplicants >= (job.maxParticipants || 1)
      });
    }

    matchedJobs.sort((a, b) => b.score - a.score);

    res.json(matchedJobs);
  } catch (err) {
    console.error("MATCH ERROR:", err);
    res.status(500).json({ message: "Error matching jobs" });
  }
});

//EMPLOYER JOB CRUD
app.get("/employer-jobs/:id", async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.params.id });
    res.json(jobs);
  } catch (err) {
    console.error("EMPLOYER JOBS ERROR:", err);
    res.status(500).json({ message: "Error fetching employer jobs" });
  }
});

// GET JOB
app.get("/jobs", async (req, res) => {
    const jobs = await Job.find();
    res.json(jobs);
});

//POST JOB
app.post("/job", upload.single("poster"), async (req, res) => {
  try {
    const job = new Job({
      title: req.body.title || "",
      location: req.body.location || "",
      skillsRequired: req.body.skillsRequired
        ? JSON.parse(req.body.skillsRequired)
        : [],
      shift: req.body.shift || "",
      startTime: req.body.startTime || "",
      endTime: req.body.endTime || "",
      workingDays: req.body.workingDays ? JSON.parse(req.body.workingDays) : [],
      workingDate: req.body.workingDate || "",
      employerId: req.body.employerId || "",
      status: "Pending",
      poster: req.file ? req.file.filename : "",
      maxParticipants: Number(req.body.maxParticipants) || 1,
      category: req.body.category || "",
      latitude: req.body.latitude ? Number(req.body.latitude) : null,
      longitude: req.body.longitude ? Number(req.body.longitude) : null
    });

    await job.save();
    res.json({ message: "Job submitted for approval", job });
  } catch (err) {
    console.error("POST JOB ERROR:", err);
    res.status(500).json({ message: "Error posting job" });
  }
});

app.put("/job/:id", upload.single("poster"), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title || "",
      location: req.body.location || "",
      workingHours: req.body.workingHours || "",
      category: req.body.category || "",
      maxParticipants: Number(req.body.maxParticipants) || 1,
      latitude: req.body.latitude ? Number(req.body.latitude) : null,
      longitude: req.body.longitude ? Number(req.body.longitude) : null
    };
    

    if (req.body.skillsRequired) {
      updateData.skillsRequired = JSON.parse(req.body.skillsRequired);
    }

    if (req.file) {
      updateData.poster = req.file.filename;
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" }
    );

    res.json({ message: "Job updated", job });
  } catch (err) {
    console.error("UPDATE JOB ERROR:", err);
    res.status(500).json({ message: "Error updating job" });
  }
});
//DELETE JOB
app.delete("/job/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error("DELETE JOB ERROR:", err);
    res.status(500).json({ message: "Error deleting job" });
  }
});

//APPLY JOB
app.post("/apply", async (req, res) => {
  try {
    const { studentId, jobId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existingApplication = await Application.findOne({ studentId, jobId });
    if (existingApplication) {
      return res.status(400).json({ message: "You already applied for this job" });
    }

    const totalApplicants = await Application.countDocuments({ jobId });

    if (totalApplicants >= job.maxParticipants) {
      return res.status(400).json({ message: "Participant limit reached" });
    }

    const application = new Application({
      studentId,
      jobId
    });

    await application.save();

    res.json({ message: "Application submitted" });
  } catch (err) {
    console.error("APPLY JOB ERROR:", err);
    res.status(500).json({ message: "Error applying job" });
  }
});

app.get("/employer-applications/:employerId", async (req, res) => {
  try {
    const employerId = req.params.employerId;

    // find only this employer's jobs
    const jobs = await Job.find({ employerId: employerId });
    const jobIds = jobs.map((job) => job._id);

    // find applications for those jobs
    const applications = await Application.find({
      jobId: { $in: jobIds },
      status: "Pending"
    }).populate("jobId");

    // attach student details
    const result = await Promise.all(
      applications.map(async (app) => {
        const student = await User.findById(app.studentId);

        return {
          _id: app._id,
          status: app.status,
          studentId: app.studentId,
          studentName: student ? student.name : "-",
          studentEmail: student ? student.email : "-",
          jobId: app.jobId
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("EMPLOYER APPLICATIONS ERROR:", err);
    res.status(500).json({ message: "Error fetching employer applications" });
  }
});

//VIEW APPLICATION
app.get("/applications/:studentId", async (req, res) => {
    try {
        const apps = await Application.find({ studentId: req.params.studentId })
            .populate("jobId");

        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: "Error fetching applications" });
    }
});

// VIEW ALL (EMPLOYER)
app.get("/allApplications", async (req, res) => {
    const apps = await Application.find().populate("jobId");
    res.json(apps);
});

//UPDATE STATUS
app.put("/application/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const appData = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    ).populate("jobId");

    if (!appData) {
      return res.status(404).json({ message: "Application not found" });
    }

    const student = await User.findById(appData.studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const message = `Your application for "${appData.jobId?.title || "the job"}" is ${req.body.status}.`;

    // save notification
    await Notification.create({
      userId: appData.studentId,
      message: `Your application for "${appData.jobId?.title || "the job"}" is ${status}.`,
      type: "application",
      isRead : false
    });

    // send email
    try {
      if (student?.email) {
        await transporter.sendMail({
          from: "yourgmail@gmail.com",
          to: student.email,
          subject: "PartTimeHub Application Update",
          text: message
        });
      }
    } catch (emailErr) {
      console.error("EMAIL SEND ERROR:", emailErr.message);
    }

    res.json({
      message: `Application ${status}`,
      appData
    });
    
  } catch (err) {
    console.error("APPLICATION STATUS ERROR:", err);
    res.status(500).json({ message: "Error updating application status" });
  }
});

app.get("/allJobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    console.error("ALL JOBS ERROR:", err);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

app.put("/jobStatus/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { returnDocument: "after" }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await Notification.create({
      userId: job.employerId,
      message: `Your job "${job.title}" is ${req.body.status}`,
      type: "job"
    });

    res.json({ message: "Job status updated", job });
  } catch (err) {
    console.error("JOB STATUS ERROR:", err);
    res.status(500).json({ message: "Error updating job status" });
  }
});

// CREATE NOTIFICATION
app.post("/notification", async (req, res) => {
  const { userId, message } = req.body;

  // 🔥 avoid duplicate reminder
  const existing = await Notification.findOne({
    userId,
    message,
    isRead: false
  });

  if (existing) {
    return res.json({ message: "Already exists" });
  }

  const note = new Notification({
    userId,
    message
  });

  await note.save();

  res.json({ message: "Notification saved" });
});

//GET USER NOTIFICATION
app.get("/notifications/:userId", async (req, res) => {
    const notes = await Notification.find({
        userId: req.params.userId
    }).sort({ createdAt: -1 });

    res.json(notes);
});

//MARK AS READ
app.put("/notification/read/:id", async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, {
        isRead: true
    });

    res.json({ message: "Notification read" });
});

// PROFILE
app.put("/profile/:id", upload.single("avatar"), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name || "",
      availability: req.body.availability || "",
      location: req.body.location || "",
      preferences: req.body.preferences || "",
      company: req.body.company || "",
      contact: req.body.contact || "",
      availableDay: req.body.availableDay || "",
      availableDate: req.body.availableDate || "",
      startTime: req.body.startTime || "",
      endTime: req.body.endTime || ""
    };

    if (req.body.skills) {
      updateData.skills = JSON.parse(req.body.skills);
    }

    if (req.file) {
      updateData.avatar = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" } // ✅ UPDATED HERE
    );

    res.json({
      message: "Profile updated",
      user: updatedUser
    });

  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

//DELETE PROFILE
app.delete("/profile/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("DELETE PROFILE ERROR:", err);
    res.status(500).json({ message: "Error deleting account" });
  }
});

// GET ALL USERS (ADMIN)
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        console.log("USERS:", users);
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching users" });
    }
});

app.get("/admin/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: "student" });
    const employers = await User.countDocuments({ role: "employer" });

    const totalApplications = await Application.countDocuments();
    const approvedApplications = await Application.countDocuments({ status: "Approved" });
    const rejectedApplications = await Application.countDocuments({ status: "Rejected" });
    const pendingApplications = await Application.countDocuments({ status: "Pending" });

    const totalJobs = await Job.countDocuments();
    const approvedJobs = await Job.countDocuments({ status: "Approved" });
    const rejectedJobs = await Job.countDocuments({ status: "Rejected" });
    const pendingJobs = await Job.countDocuments({ status: "Pending" });

    res.json({
      totalUsers,
      students,
      employers,

      totalApplications,
      approvedApplications,
      rejectedApplications,
      pendingApplications,

      totalJobs,
      approvedJobs,
      rejectedJobs,
      pendingJobs
    });
  } catch (err) {
    console.error("ADMIN STATS ERROR:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("GET USER ERROR:", err);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Admin dashboard: only pending jobs
app.get("/pendingJobs", async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Pending" });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending jobs" });
  }
});

// Admin history: all jobs
app.get("/jobHistory", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ _id: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job history" });
  }
});

app.get("/student-profile/:id", async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    res.json(student);

  } catch (err) {
    res.status(500).json({
      message: "Error loading profile"
    });
  }
});

//SEND MESSAGE
app.post("/send-message", async (req, res) => {

  try {

    const msg = await Message.create({
      senderId: req.body.senderId,
      receiverId: req.body.receiverId,
      message: req.body.message
    });

    res.json(msg);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Error sending message"
    });
  }
});

//LOAD MESSAGE
app.get("/messages/:user1/:user2", async (req, res) => {

  try {

    const messages =
      await Message.find({
        $or: [

          {
            senderId: req.params.user1,
            receiverId: req.params.user2
          },

          {
            senderId: req.params.user2,
            receiverId: req.params.user1
          }

        ]
      })
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Error loading messages"
    });
  }
});

//HISTORY APPLICATION
app.get("/employer-history/:employerId", async (req, res) => {
  try {

    const jobs = await Job.find({
      employerId: req.params.employerId
    });

    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({
      jobId: { $in: jobIds },
      status: { $in: ["Approved", "Rejected"] }
    }).populate("jobId");

    const result = await Promise.all(
      applications.map(async (app) => {

        const student =
          await User.findById(app.studentId);

        return {
          ...app.toObject(),
          studentName: student?.name,
          studentEmail: student?.email
        };
      })
    );

    res.json(result);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Error loading history"
    });
  }
});

// ADMIN CHART DATA
app.get("/admin/chart-data", async (req, res) => {
  try {
    // ===== TOP EMPLOYERS =====
    const employers = await Job.aggregate([
      {
        $group: {
          _id: "$employerId",
          totalJobs: { $sum: 1 }
        }
      },
      {
        $sort: { totalJobs: -1 }
      },
      {
        $limit: 5
      }
    ]);

    const employerChart = [];

    for (const emp of employers) {
      const user = await User.findById(emp._id);

      employerChart.push({
        employer: user ? user.name : "Unknown",
        jobs: emp.totalJobs
      });
    }

    // ===== TOP JOBS =====
    const jobs = await Application.aggregate([
      {
        $group: {
          _id: "$jobId",
          applicants: { $sum: 1 }
        }
      },
      {
        $sort: {
          applicants: -1
        }
      },
      {
        $limit: 5
      }
    ]);

    const jobChart = [];

    for (const job of jobs) {
      const found = await Job.findById(job._id);

      jobChart.push({
        title: found ? found.title : "Deleted Job",
        applicants: job.applicants
      });
    }

    res.json({
      employers: employerChart,
      jobs: jobChart
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error loading chart"
    });
  }
});
