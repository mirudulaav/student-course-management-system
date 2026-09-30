import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../auth/AuthContext";
import PageShell from "../components/PageShell";

function Login() {
  const navigate = useNavigate();

  const {
    loginStudent,
    loginAdmin
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleStudentLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/students?email=${encodeURIComponent(email)}`
      );

      const student = response.data[0];

      if (
        !student ||
        student.password !== password
      ) {
        setError(
          "Invalid email or password."
        );
        return;
      }

      loginStudent(student);

      navigate("/student-dashboard");
    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleAdminLogin(e) {
    e.preventDefault();

    const form = e.target;

    const adminEmail =
      form.email.value.trim();

    const adminPassword =
      form.password.value;

    if (
      adminEmail === "admin@gmail.com" &&
      adminPassword === "admin123"
    ) {
      const admin = {
        email: "admin@gmail.com",
        role: "admin"
      };

      loginAdmin(admin);

      navigate("/admin-dashboard");
    } else {
      setError(
        "Invalid admin email or password."
      );
    }
  }

  return (
    <PageShell>
      <main className="auth-page">
        <div className="login-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>

            <p>
              Login to access your Student Course Management
              System.
            </p>
          </div>

          <div className="login-sections">
            <div className="login-section student-login">
              <div className="login-icon">
                Student
              </div>

              <h2>Student Login</h2>

              <p className="login-description">
                Access your courses and track your learning progress.
              </p>

              <form onSubmit={handleStudentLogin}>
                {error && (
                  <p className="form-error">
                    {error}
                  </p>
                )}

                <div className="input-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Password</label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading
                    ? "Logging in..."
                    : "Login as Student"}
                </button>
              </form>
            </div>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <div className="login-section admin-login">
              <div className="login-icon">
                Admin
              </div>

              <h2>Admin Login</h2>

              <p className="login-description">
                Manage students, courses and system reports.
              </p>

              <form onSubmit={handleAdminLogin}>
                <div className="input-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Admin email"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Password</label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Admin password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="auth-button admin-button"
                >
                  Login as Admin
                </button>
              </form>
            </div>
          </div>

          <div className="auth-links">
            <p>
              Don't have an account?

              <button
                onClick={() =>
                  navigate("/register")
                }
              >
                Register
              </button>
            </p>

            <button
              onClick={() =>
                navigate("/reset-password")
              }
              className="text-button"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </main>
    </PageShell>
  );
}

export default Login;