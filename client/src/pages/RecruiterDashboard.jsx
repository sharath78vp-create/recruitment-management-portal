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
      // Fetch the number of applications BEFORE deleting
      // because the backend deletes those applications
      // together with the job.
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
        <div className="dashboard-header">
          <div>
            <h1>Recruiter Dashboard</h1>

            <p>
              Welcome back, {user?.name}
            </p>
          </div>

          <button
            className="primary-button dashboard-action"
            onClick={() =>
              navigate("/create-job")
            }
          >
            + Post New Job
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">
              Jobs Posted
            </span>

            <strong className="stat-number">
              {loading ? "—" : jobs.length}
            </strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">
              Active Jobs
            </span>

            <strong className="stat-number">
              {loading ? "—" : jobs.length}
            </strong>
          </div>

          <div className="stat-card">
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

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Your Job Postings</h2>
          </div>

          {loading ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <h3>No jobs posted yet</h3>

              <p>
                Start by creating your first
                job posting.
              </p>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map((job) => (
                <div
                  className="job-dashboard-card"
                  key={job._id}
                >
                  <h3>{job.title}</h3>

                  <p className="job-company">
                    {job.company}
                  </p>

                  <p>
                    📍 {job.location}
                  </p>

                  <p>
                    💼{" "}
                    {job.experience ||
                      "Not specified"}
                  </p>

                  <p>
                    💰{" "}
                    {job.salary ||
                      "Not specified"}
                  </p>

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

                  <div className="job-card-actions">
                    <button
                      className="view-job-button"
                      onClick={() =>
                        navigate(
                          `/recruiter/jobs/${job._id}/applicants`
                        )
                      }
                    >
                      View Applicants
                    </button>

                    <button
                      className="edit-job-button"
                      onClick={() =>
                        navigate(
                          `/edit-job/${job._id}`
                        )
                      }
                    >
                      Edit Job
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
                        : "Delete Job"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default RecruiterDashboard;