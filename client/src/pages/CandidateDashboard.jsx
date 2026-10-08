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
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await API.get("/jobs");

        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase();

    return (
      job.title.toLowerCase().includes(searchText) ||
      job.company.toLowerCase().includes(searchText) ||
      job.location.toLowerCase().includes(searchText) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchText)
      )
    );
  });

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-container">
        <div className="candidate-header">
          <div>
            <h1>Find Your Next Opportunity</h1>
            <p>Welcome back, {user?.name}</p>
          </div>

          <div className="candidate-header-actions">
            <div className="candidate-stat">
              <strong>{jobs.length}</strong>
              <span>Available Jobs</span>
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
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by job title, company, location or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>Available Jobs</h2>

            <span className="job-count">
              {filteredJobs.length} jobs found
            </span>
          </div>

          {loading ? (
            <p>Loading available jobs...</p>
          ) : filteredJobs.length === 0 ? (
            <div className="empty-state">
              <h3>No jobs found</h3>
              <p>Try changing your search.</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.map((job) => (
                <div
                  className="candidate-job-card"
                  key={job._id}
                >
                  <div className="job-card-header">
                    <div>
                      <h3>{job.title}</h3>

                      <p className="job-company">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  <div className="job-info">
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

                  <button
                    className="view-job-button"
                    onClick={() =>
                      navigate(
                        `/jobs/${job._id}`
                      )
                    }
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default CandidateDashboard;