import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div
        className="navbar-brand"
        onClick={() => navigate("/")}
      >
        Recruitment Portal
      </div>

      <div className="navbar-right">
        {user && (
          <span className="navbar-user">
            {user.name}
          </span>
        )}

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;