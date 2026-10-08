const Job = require("../models/Job");
const Application = require("../models/Application");

const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      description,
      skills,
      salary,
      experience,
    } = req.body;

    if (
      !title ||
      !company ||
      !location ||
      !description ||
      !skills ||
      !Array.isArray(skills) ||
      skills.length === 0
    ) {
      return res.status(400).json({
        message:
          "Please provide title, company, location, description and skills",
      });
    }

    const job = await Job.create({
      title,
      company,
      location,
      description,
      skills,
      salary,
      experience,
      recruiter: req.user.id,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create job",
      error: error.message,
    });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate(
        "recruiter",
        "name email"
      )
      .sort({ createdAt: -1 });

    res.json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(
      req.params.id
    ).populate(
      "recruiter",
      "name email"
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(
      req.params.id
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
          "You are not authorized to update this job",
      });
    }

    const {
      title,
      company,
      location,
      description,
      skills,
      salary,
      experience,
    } = req.body;

    job.title = title || job.title;
    job.company = company || job.company;
    job.location = location || job.location;
    job.description =
      description || job.description;
    job.skills =
      skills || job.skills;
    job.salary =
      salary !== undefined
        ? salary
        : job.salary;
    job.experience =
      experience !== undefined
        ? experience
        : job.experience;

    await job.save();

    res.json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update job",
      error: error.message,
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(
      req.params.id
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
          "You are not authorized to delete this job",
      });
    }

    await Application.deleteMany({
      job: job._id,
    });

    await Job.findByIdAndDelete(
      job._id
    );

    res.json({
      message:
        "Job and associated applications deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete job",
      error: error.message,
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};