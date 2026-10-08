const express = require("express");

const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const {
  protect,
  recruiterOnly,
  candidateOnly,
} = require("../middleware/authMiddleware");

const uploadResume = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  candidateOnly,
  uploadResume.single("resume"),
  applyForJob
);

router.get(
  "/my-applications",
  protect,
  candidateOnly,
  getMyApplications
);

router.get(
  "/job/:jobId",
  protect,
  recruiterOnly,
  getJobApplications
);

router.put(
  "/:id/status",
  protect,
  recruiterOnly,
  updateApplicationStatus
);

module.exports = router;