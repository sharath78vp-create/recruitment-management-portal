import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    skills: "",
    salary: "",
    experience: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await API.post("/jobs", {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        description: formData.description,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        salary: formData.salary,
        experience: formData.experience,
      });

      navigate("/recruiter-dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create job. Please try again."
      );
    } finally {
      setLoading(false);
    }
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

        <div className="form-page-header redesigned-form-header">

          <div>
            <span className="eyebrow">
              Recruiter workspace
            </span>

            <h1>Post a New Job</h1>

            <p>
              Create a clear job listing to
              attract the right candidates.
            </p>
          </div>

        </div>

        <div className="job-form-card redesigned-job-form">

          <div className="form-card-heading">
            <div className="form-heading-icon">
              +
            </div>

            <div>
              <h2>Job Information</h2>

              <p>
                Provide the details candidates
                need to know.
              </p>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="form-row">

              <div className="form-group">
                <label htmlFor="title">
                  Job Title
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="e.g. Software Developer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">
                  Company
                </label>

                <input
                  id="company"
                  type="text"
                  name="company"
                  placeholder="e.g. Tech Solutions Pvt Ltd"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="form-row">

              <div className="form-group">
                <label htmlFor="location">
                  Location
                </label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  placeholder="e.g. Hyderabad"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="experience">
                  Experience
                </label>

                <input
                  id="experience"
                  type="text"
                  name="experience"
                  placeholder="e.g. Fresher / 1-2 years"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="form-row">

              <div className="form-group">
                <label htmlFor="salary">
                  Salary
                </label>

                <input
                  id="salary"
                  type="text"
                  name="salary"
                  placeholder="e.g. 6-8 LPA"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="skills">
                  Required Skills
                </label>

                <input
                  id="skills"
                  type="text"
                  name="skills"
                  placeholder="Java, React, SQL, Node.js"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />

                <small>
                  Separate skills using commas.
                </small>
              </div>

            </div>

            <div className="form-group">
              <label htmlFor="description">
                Job Description
              </label>

              <textarea
                id="description"
                name="description"
                placeholder="Describe the role, responsibilities and requirements..."
                value={formData.description}
                onChange={handleChange}
                rows="8"
                required
              />

              <small>
                Include responsibilities,
                requirements and important
                expectations for the role.
              </small>
            </div>

            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  navigate(
                    "/recruiter-dashboard"
                  )
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button form-submit"
                disabled={loading}
              >
                {loading
                  ? "Posting Job..."
                  : "Post Job"}
              </button>

            </div>

          </form>

        </div>

      </main>
    </div>
  );
}

export default CreateJob;