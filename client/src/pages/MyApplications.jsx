import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await API.get(
          "/applications/my-applications"
        );

        setApplications(response.data.applications);
      } catch (error) {
        console.error(
          "Failed to fetch applications:",
          error
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

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>My Applications</h1>
            <p>
              Track the jobs you have applied for.
            </p>
          </div>

          <button
            className="secondary-button"
            onClick={() =>
              navigate("/candidate-dashboard")
            }
          >
            ← Browse Jobs
          </button>
        </div>

        {loading ? (
          <p>Loading your applications...</p>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <h3>No applications yet</h3>

            <p>
              You haven't applied for any jobs yet.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                navigate("/candidate-dashboard")
              }
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((application) => (
              <div
                className="application-card"
                key={application._id}
              >
                <div className="application-main">
                  <h2>
                    {application.job?.title ||
                      "Job no longer available"}
                  </h2>

                  <p className="job-company">
                    {application.job?.company ||
                      "Unknown company"}
                  </p>

                  {application.job?.location && (
                    <p className="application-info">
                      📍 {application.job.location}
                    </p>
                  )}

                  {application.createdAt && (
                    <p className="application-date">
                      Applied on{" "}
                      {new Date(
                        application.createdAt
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="application-right">
                  <span
                    className={getStatusClass(
                      application.status
                    )}
                  >
                    {application.status}
                  </span>

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
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyApplications;