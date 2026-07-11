import express from "express";
import Job from "../models/Job.js";

const router = express.Router();

// CREATE job
router.post("/", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all jobs
router.get("/", async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

// UPDATE job
router.put("/:id", async (req, res) => {
  const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
  res.json(updated);
});

// DELETE job
router.delete("/:id", async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ msg: "Job deleted" });
});

export default router;
