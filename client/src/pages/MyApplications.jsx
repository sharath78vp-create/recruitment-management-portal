import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await API.get(
          "/applications/my-applications"
        );

        setApplications(
          response.data.applications || []
        );
      } catch (error) {
        console.error(
          "Failed to fetch applications:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load your applications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusClass = (status) => {
    return `application-status ${status}`;
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Applied";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case "shortlisted":
        return "You have been shortlisted for this role.";

      case "selected":
        return "Congratulations! You have been selected.";

      case "rejected":
        return "This application was not selected.";

      case "applied":
      default:
        return "Your application has been submitted.";
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container">

        {/* ============================================
            HEADER
            ============================================ */}

        <div className="applications-page-header">

          <div>
            <span className="eyebrow">
              Candidate workspace
            </span>

            <h1>My Applications</h1>

            <p>
              Track the jobs you have applied
              for and monitor their status.
            </p>
          </div>

          <button
            className="secondary-button"
            onClick={() =>
              navigate(
                "/candidate-dashboard"
              )
            }
          >
            ← Browse Jobs
          </button>

        </div>

        {/* ============================================
            SUMMARY
            ============================================ */}

        {!loading && !error && (
          <div className="application-summary">

            <div className="application-summary-card">
              <span>Total applications</span>

              <strong>
                {applications.length}
              </strong>
            </div>

            <div className="application-summary-card">
              <span>Shortlisted</span>

              <strong>
                {
                  applications.filter(
                    (application) =>
                      application.status ===
                      "shortlisted"
                  ).length
                }
              </strong>
            </div>

            <div className="application-summary-card">
              <span>Selected</span>

              <strong>
                {
                  applications.filter(
                    (application) =>
                      application.status ===
                      "selected"
                  ).length
                }
              </strong>
            </div>

            <div className="application-summary-card">
              <span>Rejected</span>

              <strong>
                {
                  applications.filter(
                    (application) =>
                      application.status ===
                      "rejected"
                  ).length
                }
              </strong>
            </div>

          </div>
        )}

        {/* ============================================
            ERROR
            ============================================ */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* ============================================
            CONTENT
            ============================================ */}

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>

            <p>
              Loading your applications...
            </p>
          </div>
        ) : applications.length === 0 ? (
          <div className="empty-state applications-empty">

            <div className="empty-state-icon">
              ✓
            </div>

            <h3>No applications yet</h3>

            <p>
              You haven't applied for any jobs
              yet. Start exploring opportunities
              and submit your first application.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                navigate(
                  "/candidate-dashboard"
                )
              }
            >
              Browse Available Jobs
            </button>

          </div>
        ) : (
          <section className="applications-section">

            <div className="applications-section-header">
              <div>
                <h2>
                  Application history
                </h2>

                <p>
                  Your latest applications
                  appear first.
                </p>
              </div>

              <span>
                {applications.length}{" "}
                {applications.length === 1
                  ? "application"
                  : "applications"}
              </span>
            </div>

            <div className="applications-list">

              {applications.map(
                (application) => (
                  <article
                    className="application-card"
                    key={application._id}
                  >

                    {/* Job information */}

                    <div className="application-main">

                      <div className="application-job-header">

                        <div className="company-avatar">
                          {application.job?.company
                            ?.charAt(0)
                            .toUpperCase() ||
                            "C"}
                        </div>

                        <div>
                          <h2>
                            {application.job
                              ?.title ||
                              "Job no longer available"}
                          </h2>

                          <p className="job-company">
                            {application.job
                              ?.company ||
                              "Unknown company"}
                          </p>
                        </div>

                      </div>

                      <div className="application-details">

                        {application.job
                          ?.location && (
                          <span>
                            📍{" "}
                            {application.job
                              .location}
                          </span>
                        )}

                        {application.job
                          ?.experience && (
                          <span>
                            💼{" "}
                            {application.job
                              .experience}
                          </span>
                        )}

                        {application.job
                          ?.salary && (
                          <span>
                            ₹{" "}
                            {application.job
                              .salary}
                          </span>
                        )}

                      </div>

                      {application.createdAt && (
                        <p className="application-date">
                          Applied on{" "}
                          {new Date(
                            application.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      )}

                    </div>

                    {/* Application status/actions */}

                    <div className="application-right">

                      <span
                        className={getStatusClass(
                          application.status
                        )}
                      >
                        {formatStatus(
                          application.status
                        )}
                      </span>

                      <p className="status-description">
                        {getStatusDescription(
                          application.status
                        )}
                      </p>

                      {application.job?._id && (
                        <button
                          className="view-job-button"
                          onClick={() =>
                            navigate(
                              `/jobs/${application.job._id}`
                            )
                          }
                        >
                          View Job
                          <span>→</span>
                        </button>
                      )}

                    </div>

                  </article>
                )
              )}

            </div>
          </section>
        )}

      </main>
    </div>
  );
}

export default MyApplications;