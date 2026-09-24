import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";

function Login() {
  const navigate = useNavigate();

  function handleStudentLogin(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    const account = JSON.parse(
      sessionStorage.getItem("student") || "null"
    );

    if (!account) {
      alert("No student account found. Please register first.");
      return;
    }

    if (account.email === email && account.password === password) {
      sessionStorage.setItem(
        "loggedInStudent",
        JSON.stringify(account)
      );

      navigate("/student-dashboard");
    } else {
      alert("Invalid student email or password.");
    }
  }

  function handleAdminLogin(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (
      email === "admin@gmail.com" &&
      password === "admin123"
    ) {
      const admin = {
        email: "admin@gmail.com",
        role: "admin"
      };

      sessionStorage.setItem(
        "loggedInAdmin",
        JSON.stringify(admin)
      );

      navigate("/admin-dashboard");
    } else {
      alert("Invalid admin email or password.");
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

                <div className="input-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Password</label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="auth-button"
                >
                  Login as Student
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
              <button onClick={() => navigate("/register")}>
                Register
              </button>
            </p>

            <button
              onClick={() => navigate("/reset-password")}
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

