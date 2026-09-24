import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const student = sessionStorage.getItem("loggedInStudent");
  const admin = sessionStorage.getItem("loggedInAdmin");

  function logout() {
    sessionStorage.removeItem("loggedInStudent");
    sessionStorage.removeItem("loggedInAdmin");
    navigate("/login");
  }

  return (
    <nav className="navbar">

      <div
        className="logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        SCMS
      </div>

      <ul className="nav-links">

        <li>
          <NavLink to="/" end>
            Home
          </NavLink>
        </li>

        {!student && !admin && (
          <>
            <li>
              <NavLink to="/login">
                Login
              </NavLink>
            </li>

            <li>
              <NavLink to="/register">
                Register
              </NavLink>
            </li>
          </>
        )}

        {student && (
          <>
            <li>
              <NavLink to="/student-dashboard">
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/student-courses">
                My Courses
              </NavLink>
            </li>

            <li>
              <NavLink to="/courses">
                Courses
              </NavLink>
            </li>

            <li>
              <button
                className="nav-logout"
                onClick={logout}
              >
                Logout
              </button>
            </li>
          </>
        )}

        {admin && (
          <>
            <li>
              <NavLink to="/admin-dashboard">
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/students">
                Students
              </NavLink>
            </li>

            <li>
              <NavLink to="/courses">
                Courses
              </NavLink>
            </li>

            <li>
              <NavLink to="/reports">
                Reports
              </NavLink>
            </li>

            <li>
              <button
                className="nav-logout"
                onClick={logout}
              >
                Logout
              </button>
            </li>
          </>
        )}

        {!student && !admin && (
          <li>
            <NavLink to="/reset-password">
              Reset Password
            </NavLink>
          </li>
        )}

      </ul>

    </nav>
  );
}

export default Navbar;