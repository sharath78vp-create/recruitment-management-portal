const Application = require("../models/Application");
const Job = require("../models/Job");

const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const existingApplication =
      await Application.findOne({
        job: jobId,
        candidate: req.user.id,
      });

    if (existingApplication) {
      return res.status(400).json({
        message:
          "You have already applied for this job",
      });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      resume: req.file
        ? `/uploads/${req.file.filename}`
        : null,
    });

    res.status(201).json({
      message:
        "Application submitted successfully",
      application,
    });
  } catch (error) {
    if (req.file) {
      const fs = require("fs");
      const path = require("path");

      const filePath = path.join(
        __dirname,
        "../uploads",
        req.file.filename
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      message:
        "Failed to submit application",
      error: error.message,
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications =
      await Application.find({
        candidate: req.user.id,
      })
        .populate("job")
        .sort({ createdAt: -1 });

    res.json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to fetch applications",
      error: error.message,
    });
  }
};

const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(
      req.params.jobId
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (
      job.recruiter.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to view these applications",
      });
    }

    const applications =
      await Application.find({
        job: req.params.jobId,
      })
        .populate(
          "candidate",
          "name email"
        )
        .populate(
          "job",
          "title company"
        )
        .sort({ createdAt: -1 });

    res.json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to fetch applications",
      error: error.message,
    });
  }
};

const updateApplicationStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "applied",
      "shortlisted",
      "rejected",
      "selected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid application status",
      });
    }

    const application =
      await Application.findById(
        req.params.id
      ).populate("job");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (
      application.job.recruiter.toString() !==
      req.user.id
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to update this application",
      });
    }

    application.status = status;

    await application.save();

    res.json({
      message:
        "Application status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Failed to update application status",
      error: error.message,
    });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
};