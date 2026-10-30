import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PageShell from "../components/PageShell";
import { registerStudent } from "../api/authApi";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    const form = e.target;

    const name = form.fullname.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Calls the new backend authentication API endpoint
      const result = await registerStudent({
        name,
        email,
        password,
        department: "Computer Science" // Required by backend validation
      });

      alert(result.message || "Registration successful. Please login.");

      navigate("/login");
    } catch (err) {
      console.error(err);

      // Extracts the error message sent from your backend controller/validation middleware
      setError(
        err.response?.data?.message || "Unable to register. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <main className="auth-page">
        <div className="auth-card register-card">
          <div className="auth-header">
            <span className="details-label">
              STUDENT ACCOUNT
            </span>

            <h1>Create Account</h1>

            <p>
              Register to access the Student Course Management System.
            </p>
          </div>

          {error && (
            <p className="form-error" style={{ color: "red", marginBottom: "1rem" }}>
              {error}
            </p>
          )}

          <form onSubmit={handleRegister}>
            <div className="row">
              <div className="input-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="fullname"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="input-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="input-group">
                <label>Phone</label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="input-group">
                <label>Date of Birth</label>

                <input
                  type="date"
                  name="dob"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="input-group">
                <label>Gender</label>

                <select
                  name="gender"
                  required
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div
                className="input-group"
                aria-hidden="true"
                style={{
                  visibility: "hidden"
                }}
              >
                <label>Course</label>

                <input
                  type="text"
                  name="course"
                  value=""
                  readOnly
                />
              </div>
            </div>

            <div className="row">
              <div className="input-group">
                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="input-group">
                <label>Confirm Password</label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", textDecoration: "underline", padding: 0 }}
              >
                Login
              </button>
            </p>

            <button
              type="button"
              className="text-button"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </PageShell>
  );
}

export default Register;