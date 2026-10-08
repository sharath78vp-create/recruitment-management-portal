import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function EditJob() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await API.get(
          `/jobs/${id}`
        );

        const job = response.data;

        setFormData({
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          description: job.description || "",
          skills: job.skills?.join(", ") || "",
          salary: job.salary || "",
          experience: job.experience || "",
        });
      } catch (error) {
        console.error(
          "Failed to fetch job:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load job."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      await API.put(`/jobs/${id}`, {
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
      console.error(
        "Failed to update job:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update job. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <Navbar />

        <main className="dashboard-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>

            <p>
              Loading job details...
            </p>
          </div>
        </main>
      </div>
    );
  }

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

            <h1>Edit Job</h1>

            <p>
              Update the details of your
              existing job posting.
            </p>
          </div>

        </div>

        <div className="job-form-card redesigned-job-form">

          <div className="form-card-heading">

            <div className="form-heading-icon">
              ✎
            </div>

            <div>
              <h2>Job Information</h2>

              <p>
                Make changes to your job
                listing and save them.
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
                <label htmlFor="edit-title">
                  Job Title
                </label>

                <input
                  id="edit-title"
                  type="text"
                  name="title"
                  placeholder="e.g. Software Developer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-company">
                  Company
                </label>

                <input
                  id="edit-company"
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
                <label htmlFor="edit-location">
                  Location
                </label>

                <input
                  id="edit-location"
                  type="text"
                  name="location"
                  placeholder="e.g. Hyderabad"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-experience">
                  Experience
                </label>

                <input
                  id="edit-experience"
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
                <label htmlFor="edit-salary">
                  Salary
                </label>

                <input
                  id="edit-salary"
                  type="text"
                  name="salary"
                  placeholder="e.g. 6-8 LPA"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-skills">
                  Required Skills
                </label>

                <input
                  id="edit-skills"
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

              <label htmlFor="edit-description">
                Job Description
              </label>

              <textarea
                id="edit-description"
                name="description"
                placeholder="Describe the role, responsibilities and requirements..."
                value={formData.description}
                onChange={handleChange}
                rows="8"
                required
              />

              <small>
                Keep the description clear and
                relevant to the position.
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
                disabled={saving}
              >
                {saving
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </main>
    </div>
  );
}

export default EditJob;