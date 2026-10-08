import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Applicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] =
    useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await API.get(
          `/applications/job/${jobId}`
        );

        const fetchedApplications =
          response.data.applications || [];

        setApplications(fetchedApplications);

        if (fetchedApplications.length > 0) {
          setJob(
            fetchedApplications[0].job
          );
        } else {
          try {
            const jobResponse =
              await API.get(
                `/jobs/${jobId}`
              );

            setJob(jobResponse.data);
          } catch (jobError) {
            console.error(
              "Failed to fetch job:",
              jobError
            );
          }
        }
      } catch (error) {
        console.error(
          "Failed to fetch applicants:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load applicants."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const updateStatus = async (
    applicationId,
    status
  ) => {
    setUpdatingId(applicationId);
    setError("");

    try {
      const response = await API.put(
        `/applications/${applicationId}/status`,
        { status }
      );

      setApplications(
        (currentApplications) =>
          currentApplications.map(
            (application) =>
              application._id ===
              applicationId
                ? {
                    ...application,
                    status:
                      response.data
                        .application.status,
                  }
                : application
          )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

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

 const getResumeUrl = (resumePath) => {
  if (!resumePath) {
    return null;
  }

  const apiUrl =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  const serverUrl = apiUrl.replace(
    "/api",
    ""
  );

  return `${serverUrl}${resumePath}`;
};

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container">

        <button
          className="back-button"
          onClick={() =>
            navigate(
              "/recruiter-dashboard"
            )
          }
        >
          ← Back to Dashboard
        </button>

        {/* ============================================
            HEADER
            ============================================ */}

        <div className="applicants-page-header">

          <div>
            <span className="eyebrow">
              Candidate management
            </span>

            <h1>
              {job?.title || "Job"} — Applicants
            </h1>

            {job?.company && (
              <p>
                {job.company}
              </p>
            )}
          </div>

          <div className="applicants-count-card">
            <strong>
              {applications.length}
            </strong>

            <span>
              {applications.length === 1
                ? "Applicant"
                : "Applicants"}
            </span>
          </div>

        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>

            <p>
              Loading applicants...
            </p>
          </div>
        ) : applications.length === 0 ? (
          <div className="empty-state">

            <div className="empty-state-icon">
              @
            </div>

            <h3>No applications yet</h3>

            <p>
              Candidates who apply for this
              position will appear here.
            </p>

          </div>
        ) : (
          <section className="applicants-section">

            <div className="applicants-section-header">
              <div>
                <h2>
                  Applications received
                </h2>

                <p>
                  Review candidates and update
                  their application status.
                </p>
              </div>
            </div>

            <div className="applications-list">

              {applications.map(
                (application) => (
                  <article
                    className="applicant-card"
                    key={application._id}
                  >

                    <div className="applicant-main">

                      <div className="applicant-profile">

                        <div className="candidate-avatar">
                          {application.candidate
                            ?.name
                            ?.charAt(0)
                            .toUpperCase() ||
                            "C"}
                        </div>

                        <div>
                          <h2>
                            {application
                              .candidate
                              ?.name ||
                              "Unknown Candidate"}
                          </h2>

                          <p>
                            {application
                              .candidate
                              ?.email ||
                              "No email available"}
                          </p>
                        </div>

                      </div>

                      <div className="applicant-meta">

                        <span>
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
                        </span>

                        {application.resume && (
                          <a
                            href={getResumeUrl(
                              application.resume
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resume-button"
                          >
                            📄 View Resume
                          </a>
                        )}

                        {!application.resume && (
                          <span className="no-resume">
                            No resume uploaded
                          </span>
                        )}

                      </div>

                    </div>

                    <div className="applicant-actions">

                      <span
                        className={getStatusClass(
                          application.status
                        )}
                      >
                        {formatStatus(
                          application.status
                        )}
                      </span>

                      <div className="status-buttons">

                        <button
                          className="status-button shortlist-button"
                          disabled={
                            updatingId ===
                            application._id
                          }
                          onClick={() =>
                            updateStatus(
                              application._id,
                              "shortlisted"
                            )
                          }
                        >
                          Shortlist
                        </button>

                        <button
                          className="status-button select-button"
                          disabled={
                            updatingId ===
                            application._id
                          }
                          onClick={() =>
                            updateStatus(
                              application._id,
                              "selected"
                            )
                          }
                        >
                          Select
                        </button>

                        <button
                          className="status-button reject-button"
                          disabled={
                            updatingId ===
                            application._id
                          }
                          onClick={() =>
                            updateStatus(
                              application._id,
                              "rejected"
                            )
                          }
                        >
                          Reject
                        </button>

                      </div>

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

export default Applicants;