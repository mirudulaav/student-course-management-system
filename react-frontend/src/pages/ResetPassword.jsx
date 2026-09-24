import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";

function ResetPassword() {
  const navigate = useNavigate();

  function handleReset(e) {
    e.preventDefault();

    const form = e.target;

    const email = form.email.value.trim();
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;

    const account = JSON.parse(
      sessionStorage.getItem("student") || "null"
    );

    if (!account) {
      alert("No student account found. Please register first.");
      return;
    }

    if (account.email !== email) {
      alert("No account found with this email.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    account.password = newPassword;

    sessionStorage.setItem(
      "student",
      JSON.stringify(account)
    );

    const students = JSON.parse(
      sessionStorage.getItem("students") || "[]"
    );

    const updatedStudents = students.map((student) =>
      student.email === email
        ? {
            ...student,
            password: newPassword
          }
        : student
    );

    sessionStorage.setItem(
      "students",
      JSON.stringify(updatedStudents)
    );

    alert("Password reset successfully.");

    navigate("/login");
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
            >
              Reset Password
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