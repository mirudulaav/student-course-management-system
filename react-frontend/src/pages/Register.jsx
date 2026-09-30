import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import PageShell from "../components/PageShell";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    const form = e.target;

    const name = form.fullname.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const dob = form.dob.value;
    const gender = form.gender.value;
    const password = form.password.value;
    const confirmPassword =
      form.confirmPassword.value;

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const existing = await api.get(
        `/students?email=${encodeURIComponent(email)}`
      );

      if (existing.data.length > 0) {
        setError(
          "An account with this email already exists."
        );
        return;
      }

      const student = {
        name,
        email,
        phone,
        dob,
        gender,
        password,
        department: "Computer Science",
        year: "Final Year",
        status: "Active"
      };

      await api.post("/students", student);

      alert(
        "Registration successful. Please login."
      );

      navigate("/login");
    } catch (error) {
      console.error(error);

      setError(
        "Unable to register. Please make sure JSON Server is running."
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
            <p className="form-error">
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
              Already have an account?

              <button
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </p>

            <button
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