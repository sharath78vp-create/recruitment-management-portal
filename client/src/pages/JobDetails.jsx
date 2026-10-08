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
          <div className="loading-state">
            <div className="loading-spinner"></div>

            <p>Loading job details...</p>
          </div>
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
            <div className="empty-state-icon">
              !
            </div>

            <h3>Job not found</h3>

            <p>
              This job may have been removed or
              is no longer available.
            </p>

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

        <div className="job-details-layout">

          {/* ============================================
              MAIN JOB INFORMATION
              ============================================ */}

          <div className="job-details-main">

            <section className="job-details-card">

              <div className="job-details-header">
                <div className="company-avatar job-details-avatar">
                  {job.company
                    ?.charAt(0)
                    .toUpperCase() || "C"}
                </div>

                <div>
                  <span className="eyebrow">
                    Job opportunity
                  </span>

                  <h1>{job.title}</h1>

                  <p className="job-company">
                    {job.company}
                  </p>
                </div>
              </div>

              <div className="job-details-info">

                <span>
                  <strong>📍</strong>
                  {job.location}
                </span>

                <span>
                  <strong>💼</strong>
                  {job.experience ||
                    "Not specified"}
                </span>

                <span>
                  <strong>₹</strong>
                  {job.salary ||
                    "Not specified"}
                </span>

              </div>

              <hr />

              <section className="job-description">
                <h2>About the role</h2>

                <p>
                  {job.description}
                </p>
              </section>

              <section className="job-description">
                <h2>Required skills</h2>

                <div className="skills-container">
                  {job.skills?.map(
                    (skill, index) => (
                      <span
                        className="skill-tag"
                        key={`${skill}-${index}`}
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </section>

              {job.recruiter && (
                <section className="job-description recruiter-section">

                  <h2>Posted by</h2>

                  <div className="recruiter-info">
                    <div className="recruiter-avatar">
                      {job.recruiter.name
                        ?.charAt(0)
                        .toUpperCase() || "R"}
                    </div>

                    <div>
                      <strong>
                        {job.recruiter.name}
                      </strong>

                      {job.recruiter.email && (
                        <span>
                          {job.recruiter.email}
                        </span>
                      )}
                    </div>
                  </div>

                </section>
              )}

            </section>

          </div>

          {/* ============================================
              APPLICATION SIDEBAR
              ============================================ */}

          <aside className="job-apply-sidebar">

            <div className="apply-card">

              <div className="apply-card-heading">
                <span className="apply-icon">
                  ✓
                </span>

                <div>
                  <h2>Apply for this job</h2>

                  <p>
                    Submit your latest resume
                    to apply.
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

              <div className="resume-upload-box">

                <label
                  htmlFor="resume-input"
                  className="resume-upload-label"
                >
                  <span className="upload-icon">
                    ↑
                  </span>

                  <span>
                    Choose your resume
                  </span>
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
                  PDF only · Maximum size: 5 MB
                </small>

                {resume && (
                  <div className="selected-resume">

                    <div className="selected-resume-name">
                      <span>📄</span>

                      <span>
                        {resume.name}
                      </span>
                    </div>

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
                  ? "Submitting..."
                  : "Submit Application"}
              </button>

              <p className="apply-note">
                By submitting your application,
                your resume will be shared with
                the recruiter.
              </p>

            </div>

          </aside>

        </div>

      </main>
    </div>
  );
}

export default JobDetails;