import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function CandidateDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const storedUser = localStorage.getItem("user");
  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await API.get("/jobs");

        setJobs(response.data.jobs || []);
      } catch (error) {
        console.error(
          "Failed to fetch jobs:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const searchText = search
      .trim()
      .toLowerCase();

    if (!searchText) {
      return true;
    }

    return (
      job.title
        ?.toLowerCase()
        .includes(searchText) ||
      job.company
        ?.toLowerCase()
        .includes(searchText) ||
      job.location
        ?.toLowerCase()
        .includes(searchText) ||
      job.skills?.some((skill) =>
        skill
          .toLowerCase()
          .includes(searchText)
      )
    );
  });

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container">

        {/* =================================================
            CANDIDATE HERO
            ================================================= */}

        <section className="candidate-hero">
          <div className="candidate-hero-content">
            <span className="eyebrow">
              Career opportunities
            </span>

            <h1>
              Find your next
              <span> opportunity.</span>
            </h1>

            <p>
              Discover jobs that match your
              skills, experience and career
              goals.
            </p>
          </div>

          <div className="candidate-hero-side">
            <div className="candidate-profile-card">
              <div className="profile-avatar">
                {user?.name
                  ?.charAt(0)
                  .toUpperCase() || "U"}
              </div>

              <div>
                <span className="profile-label">
                  Signed in as
                </span>

                <strong>
                  {user?.name || "Candidate"}
                </strong>
              </div>
            </div>

            <button
              className="secondary-button"
              onClick={() =>
                navigate("/my-applications")
              }
            >
              My Applications
            </button>
          </div>
        </section>

        {/* =================================================
            SEARCH
            ================================================= */}

        <section className="candidate-search-section">
          <div className="search-heading">
            <div>
              <h2>Explore opportunities</h2>

              <p>
                Search by role, company,
                location or skill.
              </p>
            </div>

            <span className="job-count">
              {filteredJobs.length}{" "}
              {filteredJobs.length === 1
                ? "job"
                : "jobs"}
            </span>
          </div>

          <div className="search-container">
            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search jobs, companies, locations or skills..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() =>
                  setSearch("")
                }
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </section>

        {/* =================================================
            JOB LIST
            ================================================= */}

        <section className="dashboard-section">

          <div className="section-header">
            <div>
              <h2>Available Jobs</h2>

              <p>
                Find a role that fits your
                career goals.
              </p>
            </div>

            {!loading && (
              <span className="section-result-count">
                Showing {filteredJobs.length}{" "}
                of {jobs.length}
              </span>
            )}
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>

              <p>
                Finding available
                opportunities...
              </p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                🔎
              </div>

              <h3>No jobs found</h3>

              <p>
                We couldn't find any jobs
                matching your search.
              </p>

              {search && (
                <button
                  className="secondary-button"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.map((job) => (
                <article
                  className="candidate-job-card"
                  key={job._id}
                >
                  <div className="candidate-job-top">
                    <div className="company-avatar">
                      {job.company
                        ?.charAt(0)
                        .toUpperCase() || "C"}
                    </div>

                    <div className="candidate-job-heading">
                      <h3>{job.title}</h3>

                      <p className="job-company">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  <div className="job-info">
                    <span>
                      <span className="job-info-icon">
                        📍
                      </span>
                      {job.location}
                    </span>

                    <span>
                      <span className="job-info-icon">
                        💼
                      </span>
                      {job.experience ||
                        "Not specified"}
                    </span>

                    <span>
                      <span className="job-info-icon">
                        ₹
                      </span>
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

                  <div className="candidate-job-footer">
                    <span className="posted-label">
                      View full job details
                    </span>

                    <button
                      className="view-job-button"
                      onClick={() =>
                        navigate(
                          `/jobs/${job._id}`
                        )
                      }
                    >
                      View Details
                      <span>→</span>
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

export default CandidateDashboard;