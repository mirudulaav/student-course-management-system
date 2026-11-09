import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useCourses } from "../context/CourseContext";
import { useStudents } from "../context/StudentContext";
import PageShell from "../components/PageShell";

function Reports() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { loggedInAdmin } = useAuth();

  const {
    courses,
    loading: coursesLoading
  } = useCourses();

  const {
    students,
    enrollments,
    loading: studentsLoading
  } = useStudents();

  if (coursesLoading || studentsLoading) {
    return <p>Loading reports...</p>;
  }

  if (!loggedInAdmin) {
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

  const totalStudents = students.length;
  const totalCourses = courses.length;
  const totalEnrollments = enrollments.length;

  const completed = enrollments.filter(
    (enrollment) =>
      String(enrollment.status).toLowerCase() === "completed"
  ).length;

  const inProgress = enrollments.filter(
    (enrollment) =>
      String(enrollment.status).toLowerCase() !== "completed"
  ).length;

  const averageProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce(
            (total, enrollment) =>
              total +
              Number(enrollment.progress || 0),
            0
          ) / enrollments.length
        )
      : 0;

  const courseReport = {};

  enrollments.forEach((enrollment) => {
    const course = courses.find(
      (item) =>
        String(item.id) ===
        String(enrollment.courseId)
    );

    if (!course) {
      return;
    }

    if (!courseReport[course.id]) {
      courseReport[course.id] = {
        name: course.courseName,
        enrollments: 0,
        progress: 0
      };
    }

    courseReport[course.id].enrollments += 1;

    courseReport[course.id].progress += Number(
      enrollment.progress || 0
    );
  });

  const courseReports = Object.values(
    courseReport
  ).map((course) => ({
    ...course,
    progress: Math.round(
      course.progress / course.enrollments
    )
  }));

  const progressRows = enrollments
    .map((enrollment) => {
      const student = students.find(
        (item) => String(item.id) === String(enrollment.studentId)
      );
      const course = courses.find(
        (item) => String(item.id) === String(enrollment.courseId)
      );

      return {
        id: enrollment.id,
        studentName: student?.name || "Unknown student",
        email: student?.email || "",
        courseName: course?.courseName || "Course",
        progress: Number(enrollment.progress || 0),
        status: enrollment.status
      };
    })
    .filter((row) =>
      `${row.studentName} ${row.email}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    )
    .sort((a, b) => a.studentName.localeCompare(b.studentName));

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
            onClick={() =>
              navigate("/admin-dashboard")
            }
          >
            ← Dashboard
          </button>
        </section>

        <section className="report-summary">
          <div className="report-summary-card">
            <span>TOTAL STUDENTS</span>
            <strong>{totalStudents}</strong>
          </div>

          <div className="report-summary-card">
            <span>TOTAL ENROLLMENTS</span>
            <strong>{totalEnrollments}</strong>
          </div>

          <div className="report-summary-card">
            <span>IN PROGRESS</span>
            <strong>{inProgress}</strong>
          </div>

          <div className="report-summary-card">
            <span>COMPLETED</span>
            <strong>{completed}</strong>
          </div>

          <div className="report-summary-card">
            <span>TOTAL COURSES</span>
            <strong>{totalCourses}</strong>
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
                  {courseReports.map(
                    (course, index) => (
                      <tr key={course.name}>
                        <td>
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </td>

                        <td>
                          <strong>
                            {course.name}
                          </strong>
                        </td>

                        <td>
                          {course.enrollments}
                        </td>

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

                            <span>
                              {course.progress}%
                            </span>
                          </div>
                        </td>

                        <td>
                          {course.progress === 100
                            ? "Completed"
                            : "In Progress"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="course-report-section">
          <div className="report-section-header">
            <div>
              <span className="details-label">STUDENT ANALYSIS</span>
              <h2>Student Progress Report</h2>
              <p>See how each student is progressing in each course.</p>
            </div>
          </div>

          <input
            type="search"
            placeholder="Search by student name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search by student name or email"
            style={{ width: "100%", maxWidth: 360, marginBottom: 16, padding: 10 }}
          />

          {progressRows.length === 0 ? (
            <p>No matching enrollment data.</p>
          ) : (
            <div className="course-report-table-wrapper">
              <table className="course-report-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Progress</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {progressRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.studentName}</td>
                      <td>{row.email}</td>
                      <td>{row.courseName}</td>
                      <td>{row.progress}%</td>
                      <td>
                        {String(row.status).toLowerCase() === "completed"
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