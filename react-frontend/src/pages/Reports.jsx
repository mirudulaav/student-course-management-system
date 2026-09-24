import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";

function Reports() {
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

  const completed = enrollments.filter(
    (enrollment) => enrollment.status === "Completed"
  ).length;

  const inProgress = enrollments.filter(
    (enrollment) => enrollment.status !== "Completed"
  ).length;

  const averageProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce(
            (total, enrollment) =>
              total + Number(enrollment.progress || 0),
            0
          ) / enrollments.length
        )
      : 0;

  const courseReport = enrollments.reduce((result, enrollment) => {
    const courseName = enrollment.course;

    if (!result[courseName]) {
      result[courseName] = {
        name: courseName,
        enrollments: 0,
        progress: 0
      };
    }

    result[courseName].enrollments += 1;
    result[courseName].progress += Number(
      enrollment.progress || 0
    );

    return result;
  }, {});

  const courseReports = Object.values(courseReport).map(
    (course) => ({
      ...course,
      progress: Math.round(
        course.progress / course.enrollments
      )
    })
  );

  if (!admin) {
    return (
      <PageShell>
        <main className="container">
          <div className="empty-state">
            <h1>Admin Login Required</h1>

            <p>
              Please login as an administrator to view reports.
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
      <main className="reports-page">
        <section className="reports-header">
          <div>
            <span className="details-label">
              SYSTEM REPORTS
            </span>

            <h1>Enrollment Reports</h1>

            <p>
              Monitor student enrollment activity and course
              learning progress.
            </p>
          </div>

          <button
            className="secondary-button"
            onClick={() => navigate("/admin-dashboard")}
          >
            ← Dashboard
          </button>
        </section>

        <section className="report-summary">
          <div className="report-summary-card">
            <span>TOTAL STUDENTS</span>
            <strong>{students.length}</strong>
          </div>

          <div className="report-summary-card">
            <span>TOTAL ENROLLMENTS</span>
            <strong>{enrollments.length}</strong>
          </div>

          <div className="report-summary-card">
            <span>IN PROGRESS</span>
            <strong>{inProgress}</strong>
          </div>

          <div className="report-summary-card">
            <span>COMPLETED</span>
            <strong>{completed}</strong>
          </div>
        </section>

        <section className="report-progress-section">
          <div className="report-section-header">
            <div>
              <span className="details-label">
                OVERALL PERFORMANCE
              </span>

              <h2>Average Course Progress</h2>
            </div>

            <strong>{averageProgress}%</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${averageProgress}%`
              }}
            ></div>
          </div>

          <p>
            Average learning progress across all current
            enrollments.
          </p>
        </section>

        <section className="course-report-section">
          <div className="report-section-header">
            <div>
              <span className="details-label">
                COURSE ANALYSIS
              </span>

              <h2>Course Enrollment Report</h2>
            </div>
          </div>

          {courseReports.length === 0 ? (
            <div className="reports-empty">
              <h3>No Enrollment Data</h3>

              <p>
                Course reports will appear after students
                enroll in courses.
              </p>
            </div>
          ) : (
            <div className="course-report-table-wrapper">
              <table className="course-report-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Course</th>
                    <th>Enrollments</th>
                    <th>Average Progress</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {courseReports.map((course, index) => (
                    <tr key={course.name}>
                      <td>
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      <td>
                        <strong>{course.name}</strong>
                      </td>

                      <td>{course.enrollments}</td>

                      <td>
                        <div className="table-progress">
                          <div className="table-progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${course.progress}%`
                              }}
                            ></div>
                          </div>

                          <span>{course.progress}%</span>
                        </div>
                      </td>

                      <td>
                        {course.progress === 100
                          ? "Completed"
                          : "In Progress"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </PageShell>
  );
}

export default Reports;