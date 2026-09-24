import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";

function AdminDashboard() {
  const navigate = useNavigate();

  const admin = JSON.parse(
    sessionStorage.getItem("loggedInAdmin") || "null"
  );

  const students = JSON.parse(
    sessionStorage.getItem("students") || "[]"
  );

  const enrollments = JSON.parse(
    sessionStorage.getItem("enrollments") || "[]"
  );

  const courses = [
    "Machine Learning",
    "Deep Learning",
    "Large Language Models",
    "Natural Language Processing",
    "Computer Vision",
    "Generative AI",
    "Python Programming",
    "Data Science",
    "Cloud Computing",
    "Cyber Security",
    "Blockchain",
    "Internet of Things",
    "Big Data",
    "DevOps",
    "Data Structures & Algorithms"
  ];

  const completedEnrollments = enrollments.filter(
    (enrollment) => enrollment.status === "Completed"
  ).length;

  const activeEnrollments = enrollments.filter(
    (enrollment) => enrollment.status !== "Completed"
  ).length;

  function logout() {
    sessionStorage.removeItem("loggedInAdmin");
    navigate("/login");
  }

  if (!admin) {
    return (
      <PageShell>
        <main className="container">
          <div className="empty-state">
            <h1>Admin Login Required</h1>

            <p>
              Please login as an administrator to access the
              dashboard.
            </p>

            <button
              className="primary-button"
              onClick={() => navigate("/login")}
            >
              Login as Admin
            </button>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="admin-dashboard-page">
        <section className="admin-dashboard-header">
          <div>
            <span className="details-label">
              ADMINISTRATION
            </span>

            <h1>Admin Dashboard</h1>

            <p>
              Manage students, courses, enrollments and system
              reports from one place.
            </p>
          </div>

          <div className="admin-welcome">
            <span>Logged in as</span>
            <strong>{admin.email}</strong>
          </div>
        </section>

        <section className="admin-stats">
          <div className="admin-stat-card">
            <span>TOTAL STUDENTS</span>
            <strong>{students.length}</strong>
            <p>Registered students</p>
          </div>

          <div className="admin-stat-card">
            <span>TOTAL COURSES</span>
            <strong>{courses.length}</strong>
            <p>Available courses</p>
          </div>

          <div className="admin-stat-card">
            <span>TOTAL ENROLLMENTS</span>
            <strong>{enrollments.length}</strong>
            <p>Course enrollments</p>
          </div>

          <div className="admin-stat-card">
            <span>ACTIVE ENROLLMENTS</span>
            <strong>{activeEnrollments}</strong>
            <p>Courses in progress</p>
          </div>
        </section>

        <section className="admin-management-grid">
          <article className="admin-management-card">
            <span className="management-number">01</span>

            <h2>Student Management</h2>

            <p>
              View registered students and manage student
              information.
            </p>

            <button
              className="primary-button"
              onClick={() => navigate("/students")}
            >
              Manage Students
            </button>
          </article>

          <article className="admin-management-card">
            <span className="management-number">02</span>

            <h2>Course Management</h2>

            <p>
              View the available courses offered through the
              system.
            </p>

            <button
              className="primary-button"
              onClick={() => navigate("/courses")}
            >
              View Courses
            </button>
          </article>

          <article className="admin-management-card">
            <span className="management-number">03</span>

            <h2>Enrollment Reports</h2>

            <p>
              Review enrollment activity and course progress
              information.
            </p>

            <button
              className="primary-button"
              onClick={() => navigate("/reports")}
            >
              View Reports
            </button>
          </article>
        </section>

        <section className="admin-overview">
          <div className="admin-overview-header">
            <div>
              <span className="details-label">
                SYSTEM OVERVIEW
              </span>

              <h2>Enrollment Summary</h2>
            </div>
          </div>

          <div className="admin-overview-content">
            <div className="overview-item">
              <span>Total Enrollments</span>
              <strong>{enrollments.length}</strong>
            </div>

            <div className="overview-item">
              <span>In Progress</span>
              <strong>{activeEnrollments}</strong>
            </div>

            <div className="overview-item">
              <span>Completed</span>
              <strong>{completedEnrollments}</strong>
            </div>
          </div>
        </section>

        <section className="admin-logout">
          <button
            className="secondary-button"
            onClick={logout}
          >
            Logout
          </button>
        </section>
      </main>
    </PageShell>
  );
}

export default AdminDashboard;