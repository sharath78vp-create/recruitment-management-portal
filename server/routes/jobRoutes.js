const express = require("express");

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const {
  protect,
  recruiterOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getJobs);
router.get("/:id", getJobById);

// Recruiter-only routes
router.post("/", protect, recruiterOnly, createJob);
router.put("/:id", protect, recruiterOnly, updateJob);
router.delete("/:id", protect, recruiterOnly, deleteJob);

module.exports = router;