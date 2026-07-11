const mongoose = require("mongoose");
import Application from "../models/Application.js";

const router = express.Router();

// CREATE application
router.post("/", async (req, res) => {
  const app = await Application.create(req.body);
  res.json(app);
});

// READ all applications
router.get("/", async (req, res) => {
  const apps = await Application.find().populate("student_id job_id");
  res.json(apps);
});

// UPDATE application status
router.put("/:id", async (req, res) => {
  const updated = await Application.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
  res.json(updated);
});

// DELETE application
router.delete("/:id", async (req, res) => {
  await Application.findByIdAndDelete(req.params.id);
  res.json({ msg: "Application deleted" });
});

export default router;
