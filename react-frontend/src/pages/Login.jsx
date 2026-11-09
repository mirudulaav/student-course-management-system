import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginStudent as authenticateStudent } from "../api/authApi";
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
  const [adminError, setAdminError] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  async function handleStudentLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setAdminError("");

      const result = await authenticateStudent({
        email: email.trim(),
        password
      });

      if (!result?.token || !result?.student) {
        throw new Error("Login response did not include a token and student.");
      }

      sessionStorage.setItem("token", result.token);
      sessionStorage.setItem("role", result.student.role);
      sessionStorage.setItem(
        "loggedInStudent",
        JSON.stringify(result.student)
      );
      loginStudent(result.student);

      navigate("/student-courses");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to log in. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleAdminLogin(e) {
    e.preventDefault();

    const form = e.target;
    const adminEmail = form.email.value.trim();
    const adminPassword = form.password.value;

    try {
      // 2. Use setAdminLoading instead of setLoading
      setAdminLoading(true);
      setError("");
      setAdminError("");

      const result = await authenticateStudent({
        email: adminEmail,
        password: adminPassword
      });

      if (!result?.token || result.student?.role !== "admin") {
        throw new Error("Not an admin account");
      }

      sessionStorage.setItem("token", result.token);
      sessionStorage.setItem("role", result.student.role);

      loginAdmin(result.student);
      navigate("/admin-dashboard");
    } catch (err) {
      console.error(err);
      setAdminError("Invalid admin email or password.");
    } finally {
      // 3. Reset adminLoading in finally
      setAdminLoading(false);
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
                {adminError && (
                  <p className="form-error">
                    {adminError}
                  </p>
                )}

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

                {/* 4. Add disabled and dynamic text for admin button */}
                <button
                  type="submit"
                  className="auth-button admin-button"
                  disabled={adminLoading}
                >
                  {adminLoading
                    ? "Logging in..."
                    : "Login as Admin"}
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