import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function RecruiterDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applicationCount, setApplicationCount] =
    useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await API.get("/jobs");

        const allJobs = response.data.jobs || [];

        const recruiterJobs = allJobs.filter(
          (job) =>
            String(job.recruiter?._id) ===
            String(user?.id)
        );

        setJobs(recruiterJobs);

        let totalApplications = 0;

        for (const job of recruiterJobs) {
          try {
            const applicationResponse =
              await API.get(
                `/applications/job/${job._id}`
              );

            totalApplications +=
              applicationResponse.data.count || 0;
          } catch (error) {
            console.error(
              `Failed to fetch applications for ${job.title}:`,
              error
            );
          }
        }

        setApplicationCount(totalApplications);
      } catch (error) {
        console.error(
          "Failed to fetch dashboard data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const handleDeleteJob = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(jobId);

    try {
      let deletedJobApplicationCount = 0;

      try {
        const applicationResponse =
          await API.get(
            `/applications/job/${jobId}`
          );

        deletedJobApplicationCount =
          applicationResponse.data.count || 0;
      } catch (error) {
        console.error(
          "Failed to get application count before deletion:",
          error
        );
      }

      await API.delete(`/jobs/${jobId}`);

      setJobs((currentJobs) =>
        currentJobs.filter(
          (job) => job._id !== jobId
        )
      );

      setApplicationCount(
        (currentCount) =>
          Math.max(
            0,
            currentCount -
              deletedJobApplicationCount
          )
      );
    } catch (error) {
      console.error(
        "Failed to delete job:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete job. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container">

        {/* ============================================
            HEADER
            ============================================ */}

        <div className="recruiter-hero">

          <div>
            <span className="eyebrow">
              Recruiter workspace
            </span>

            <h1>
              Manage your
              <span> hiring pipeline.</span>
            </h1>

            <p>
              Create job opportunities, review
              candidates and manage applications
              from one place.
            </p>
          </div>

          <button
            className="primary-button recruiter-post-button"
            onClick={() =>
              navigate("/create-job")
            }
          >
            + Post New Job
          </button>

        </div>

        {/* ============================================
            STATS
            ============================================ */}

        <div className="stats-grid recruiter-stats-grid">

          <div className="stat-card recruiter-stat-card">
            <div className="recruiter-stat-icon">
              #
            </div>

            <div>
              <span className="stat-label">
                Jobs Posted
              </span>

              <strong className="stat-number">
                {loading ? "—" : jobs.length}
              </strong>
            </div>
          </div>

          <div className="stat-card recruiter-stat-card">
            <div className="recruiter-stat-icon">
              ✓
            </div>

            <div>
              <span className="stat-label">
                Active Jobs
              </span>

              <strong className="stat-number">
                {loading ? "—" : jobs.length}
              </strong>
            </div>
          </div>

          <div className="stat-card recruiter-stat-card">
            <div className="recruiter-stat-icon">
              @
            </div>

            <div>
              <span className="stat-label">
                Applications
              </span>

              <strong className="stat-number">
                {loading
                  ? "—"
                  : applicationCount}
              </strong>
            </div>
          </div>

        </div>

        {/* ============================================
            JOB POSTINGS
            ============================================ */}

        <section className="dashboard-section">

          <div className="section-header recruiter-section-header">

            <div>
              <h2>Your Job Postings</h2>

              <p>
                Manage the roles currently
                posted by you.
              </p>
            </div>

            {!loading && (
              <span className="section-result-count">
                {jobs.length}{" "}
                {jobs.length === 1
                  ? "job"
                  : "jobs"}
              </span>
            )}

          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>

              <p>
                Loading your job postings...
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">

              <div className="empty-state-icon">
                +
              </div>

              <h3>No jobs posted yet</h3>

              <p>
                Create your first job posting
                to start receiving applications.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  navigate("/create-job")
                }
              >
                Create Your First Job
              </button>

            </div>
          ) : (
            <div className="recruiter-jobs-grid">

              {jobs.map((job) => (
                <article
                  className="recruiter-job-card"
                  key={job._id}
                >

                  <div className="recruiter-job-top">

                    <div className="company-avatar">
                      {job.company
                        ?.charAt(0)
                        .toUpperCase() || "C"}
                    </div>

                    <div>
                      <h3>{job.title}</h3>

                      <p className="job-company">
                        {job.company}
                      </p>
                    </div>

                  </div>

                  <div className="recruiter-job-info">

                    <span>
                      📍 {job.location}
                    </span>

                    <span>
                      💼{" "}
                      {job.experience ||
                        "Not specified"}
                    </span>

                    <span>
                      ₹{" "}
                      {job.salary ||
                        "Not specified"}
                    </span>

                  </div>

                  <div className="skills-container">
                    {job.skills?.map(
                      (skill, index) => (
                        <span
                          className="skill-tag"
                          key={`${job._id}-${index}`}
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>

                  <div className="recruiter-job-actions">

                    <button
                      className="view-job-button"
                      onClick={() =>
                        navigate(
                          `/recruiter/jobs/${job._id}/applicants`
                        )
                      }
                    >
                      Applicants
                    </button>

                    <button
                      className="edit-job-button"
                      onClick={() =>
                        navigate(
                          `/edit-job/${job._id}`
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-job-button"
                      onClick={() =>
                        handleDeleteJob(job._id)
                      }
                      disabled={
                        deletingId === job._id
                      }
                    >
                      {deletingId === job._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default RecruiterDashboard;