import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const {
    loggedInStudent,
    loggedInAdmin,
    logoutStudent,
    logoutAdmin
  } = useAuth();

  function logout() {
    if (loggedInStudent) logoutStudent();
    if (loggedInAdmin) logoutAdmin();
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

        {!loggedInStudent && !loggedInAdmin && (
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

        {loggedInStudent && (
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

        {loggedInAdmin && (
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

        {!loggedInStudent && !loggedInAdmin && (
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