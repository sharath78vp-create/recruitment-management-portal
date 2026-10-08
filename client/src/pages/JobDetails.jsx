import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [resume, setResume] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] =
    useState("");
  const [applicationError, setApplicationError] =
    useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await API.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch job:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleResumeChange = (e) => {
    const selectedFile = e.target.files?.[0];

    setApplicationMessage("");
    setApplicationError("");

    if (!selectedFile) {
      setResume(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setResume(null);

      setApplicationError(
        "Only PDF resumes are allowed."
      );

      e.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setResume(null);

      setApplicationError(
        "Resume must be smaller than 5 MB."
      );

      e.target.value = "";
      return;
    }

    setResume(selectedFile);
  };

  const handleApply = async () => {
    setApplicationMessage("");
    setApplicationError("");

    if (!resume) {
      setApplicationError(
        "Please select your resume before applying."
      );

      return;
    }

    setApplying(true);

    try {
      const formData = new FormData();

      formData.append("jobId", id);
      formData.append("resume", resume);

      await API.post(
        "/applications",
        formData
      );

      setApplicationMessage(
        "Application submitted successfully!"
      );

      setResume(null);

      const fileInput =
        document.getElementById(
          "resume-input"
        );

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      setApplicationError(
        error.response?.data?.message ||
          "Failed to submit application. Please try again."
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />

        <main className="dashboard-container">
          <p>Loading job details...</p>
        </main>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="dashboard-page">
        <Navbar />

        <main className="dashboard-container">
          <div className="empty-state">
            <h3>Job not found</h3>

            <button
              className="primary-button"
              onClick={() =>
                navigate(
                  "/candidate-dashboard"
                )
              }
            >
              Back to Jobs
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container">
        <button
          className="back-button"
          onClick={() =>
            navigate(
              "/candidate-dashboard"
            )
          }
        >
          ← Back to Jobs
        </button>

        <div className="job-details-card">
          <div className="job-details-header">
            <div>
              <h1>{job.title}</h1>

              <p className="job-company">
                {job.company}
              </p>
            </div>
          </div>

          {applicationMessage && (
            <div className="success-message">
              {applicationMessage}
            </div>
          )}

          {applicationError && (
            <div className="error-message">
              {applicationError}
            </div>
          )}

          <div className="job-details-info">
            <span>
              📍 {job.location}
            </span>

            <span>
              💼{" "}
              {job.experience ||
                "Not specified"}
            </span>

            <span>
              💰{" "}
              {job.salary ||
                "Not specified"}
            </span>
          </div>

          <hr />

          <section className="job-description">
            <h2>Job Description</h2>

            <p>{job.description}</p>
          </section>

          <section className="job-description">
            <h2>Required Skills</h2>

            <div className="skills-container">
              {job.skills.map(
                (skill, index) => (
                  <span
                    className="skill-tag"
                    key={index}
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </section>

          {job.recruiter && (
            <section className="job-description">
              <h2>Recruiter</h2>

              <p>
                {job.recruiter.name}
              </p>
            </section>
          )}

          <hr />

          <section className="apply-section">
            <h2>Apply for this Job</h2>

            <p className="apply-description">
              Upload your latest resume to
              apply for this position.
            </p>

            <div className="resume-upload-box">
              <label
                htmlFor="resume-input"
                className="resume-upload-label"
              >
                Choose Resume
              </label>

              <input
                id="resume-input"
                type="file"
                accept=".pdf,application/pdf"
                onChange={
                  handleResumeChange
                }
              />

              <small>
                PDF only • Maximum size: 5 MB
              </small>

              {resume && (
                <div className="selected-resume">
                  <span>
                    📄 {resume.name}
                  </span>

                  <span>
                    {(
                      resume.size /
                      (1024 * 1024)
                    ).toFixed(2)}{" "}
                    MB
                  </span>
                </div>
              )}
            </div>

            <button
              className="primary-button apply-button"
              onClick={handleApply}
              disabled={applying}
            >
              {applying
                ? "Submitting Application..."
                : "Submit Application"}
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default JobDetails;