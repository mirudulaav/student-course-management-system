import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import PageShell from "../components/PageShell";

function ResetPassword() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e) {
    e.preventDefault();

    const form = e.target;

    const email = form.email.value.trim();
    const newPassword = form.newPassword.value;
    const confirmPassword =
      form.confirmPassword.value;

    if (newPassword.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/students?email=${encodeURIComponent(email)}`
      );

      const student = response.data[0];

      if (!student) {
        setError(
          "No account found with this email."
        );
        return;
      }

      await api.patch(
        `/students/${student.id}`,
        {
          password: newPassword
        }
      );

      alert(
        "Password reset successfully."
      );

      navigate("/login");
    } catch (error) {
      console.error(error);

      setError(
        "Unable to reset password. Please make sure JSON Server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <main className="auth-page">
        <div className="auth-card reset-card">
          <div className="auth-header">
            <span className="details-label">
              ACCOUNT SECURITY
            </span>

            <h1>Reset Password</h1>

            <p>
              Create a new password for your student account.
            </p>
          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <form onSubmit={handleReset}>
            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your registered email"
                required
              />
            </div>

            <div className="input-group">
              <label>New Password</label>

              <input
                type="password"
                name="newPassword"
                placeholder="Create a new password"
                required
              />
            </div>

            <div className="input-group">
              <label>Confirm New Password</label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your new password"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading
                ? "Resetting..."
                : "Reset Password"}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Remember your password?

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

export default ResetPassword;