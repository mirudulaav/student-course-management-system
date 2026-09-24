import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";

function Register() {
  const navigate = useNavigate();

  function handleRegister(e) {
    e.preventDefault();

    const form = e.target;

    const fullname = form.fullname.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const dob = form.dob.value;
    const gender = form.gender.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const student = {
      fullname,
      email,
      phone,
      dob,
      gender,
      password
    };

    sessionStorage.setItem("student", JSON.stringify(student));

    const students = JSON.parse(
      sessionStorage.getItem("students") || "[]"
    );

    const existingStudent = students.find(
      (item) => item.email === email
    );

    if (!existingStudent) {
      students.push(student);
      sessionStorage.setItem(
        "students",
        JSON.stringify(students)
      );
    }

    alert("Registration successful. Please login.");
    navigate("/login");
  }

  return (
    <PageShell>
      <main className="auth-page">
        <div className="auth-card register-card">
          <div className="auth-header">
            <span className="details-label">STUDENT ACCOUNT</span>
            <h1>Create Account</h1>
            <p>Register to access the Student Course Management System.</p>
          </div>

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
                <select name="gender" required>
                  <option value="">Select gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="input-group" aria-hidden="true" style={{ visibility: "hidden" }}>
                <label>Course</label>
                <input type="text" name="course" value="" readOnly />
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

            <button type="submit" className="auth-button">
              Create Account
            </button>
          </form>

          <div className="auth-links">
            <p>
              Already have an account?
              <button onClick={() => navigate("/login")}>
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