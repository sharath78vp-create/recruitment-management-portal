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

        <div className="form-page-header">

          <h1>Post a New Job</h1>

          <p>
            Create a job posting and start receiving applications.
          </p>

        </div>

        <div className="job-form-card">

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Job Title + Company */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Job Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Software Developer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Company
                </label>

                <input
                  type="text"
                  name="company"
                  placeholder="e.g. Tech Solutions Pvt Ltd"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* Location + Experience */}

            <div className="form-row">

              <div className="form-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Hyderabad"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Experience
                </label>

                <input
                  type="text"
                  name="experience"
                  placeholder="e.g. Fresher / 1-2 years"
                  value={formData.experience}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* Salary */}

            <div className="form-group">

              <label>
                Salary
              </label>

              <input
                type="text"
                name="salary"
                placeholder="e.g. 6-8 LPA"
                value={formData.salary}
                onChange={handleChange}
              />

            </div>

            {/* Skills */}

            <div className="form-group">

              <label>
                Skills
              </label>

              <input
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

            {/* Description */}

            <div className="form-group">

              <label>
                Job Description
              </label>

              <textarea
                name="description"
                placeholder="Describe the role, responsibilities and requirements..."
                value={formData.description}
                onChange={handleChange}
                rows="7"
                required
              />

            </div>

            {/* Buttons */}

            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  navigate("/recruiter-dashboard")
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