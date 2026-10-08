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

        setApplications(
          response.data.applications
        );

        if (
          response.data.applications.length > 0
        ) {
          setJob(
            response.data.applications[0].job
          );
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

  const getResumeUrl = (resumePath) => {
    if (!resumePath) {
      return null;
    }

    return `http://localhost:5000${resumePath}`;
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

        <div className="dashboard-header">
          <div>
            <h1>
              {job?.title || "Job"} — Applicants
            </h1>

            {job?.company && (
              <p>{job.company}</p>
            )}
          </div>

          <div className="candidate-stat">
            <strong>
              {applications.length}
            </strong>

            <span>Applicants</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading applicants...</p>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <h3>No applications yet</h3>

            <p>
              Candidates who apply for this job
              will appear here.
            </p>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map(
              (application) => (
                <div
                  className="application-card"
                  key={application._id}
                >
                  <div className="application-main">
                    <h2>
                      {application.candidate
                        ?.name ||
                        "Unknown Candidate"}
                    </h2>

                    <p className="job-company">
                      {application.candidate
                        ?.email ||
                        "No email available"}
                    </p>

                    <p className="application-date">
                      Applied on{" "}
                      {new Date(
                        application.createdAt
                      ).toLocaleDateString()}
                    </p>

                    {application.resume ? (
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
                    ) : (
                      <span className="no-resume">
                        No resume uploaded
                      </span>
                    )}
                  </div>

                  <div className="applicant-actions">
                    <span
                      className={getStatusClass(
                        application.status
                      )}
                    >
                      {application.status}
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
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Applicants;