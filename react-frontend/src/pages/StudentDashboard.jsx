import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";

function StudentDashboard() {
  const navigate = useNavigate();

  const student = JSON.parse(
    sessionStorage.getItem("loggedInStudent") || "null"
  );

  const enrollments = JSON.parse(
    sessionStorage.getItem("enrollments") || "[]"
  );

  const studentCourses = student
    ? enrollments.filter(
        (enrollment) =>
          enrollment.studentEmail === student.email
      )
    : [];

  const totalCourses = studentCourses.length;

  const completedCourses = studentCourses.filter(
    (course) => course.status === "Completed"
  ).length;

  const overallProgress =
    totalCourses > 0
      ? Math.round(
          studentCourses.reduce(
            (total, course) =>
              total + Number(course.progress || 0),
            0
          ) / totalCourses
        )
      : 0;

  function logout() {
    sessionStorage.removeItem("loggedInStudent");
    navigate("/login");
  }

  if (!student) {
    return (
      <PageShell>
        <main className="container">
          <div className="empty-state">
            <h1>Login Required</h1>

            <p>
              Please login as a student to access your dashboard.
            </p>

            <button
              className="primary-button"
              onClick={() => navigate("/login")}
            >
              Login as Student
            </button>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="student-dashboard-page">
        <section className="student-dashboard-header">
          <div>
            <span className="details-label">
              STUDENT DASHBOARD
            </span>

            <h1>
              Welcome, {student.fullname}
            </h1>

            <p>
              Track your courses, monitor your progress and
              continue your learning journey.
            </p>
          </div>

          <button
            className="secondary-button dashboard-courses-button"
            onClick={() => navigate("/courses")}
          >
            Explore Courses
          </button>
        </section>

        <section className="student-stats">
          <div className="student-stat-card">
            <span>ENROLLED COURSES</span>
            <strong>{totalCourses}</strong>
            <p>Courses you are currently learning</p>
          </div>

          <div className="student-stat-card">
            <span>COMPLETED COURSES</span>
            <strong>{completedCourses}</strong>
            <p>Courses completed successfully</p>
          </div>

          <div className="student-stat-card">
            <span>OVERALL PROGRESS</span>
            <strong>{overallProgress}%</strong>
            <p>Your average learning progress</p>
          </div>
        </section>

        <section className="dashboard-progress-card">
          <div className="dashboard-progress-header">
            <div>
              <span className="details-label">
                LEARNING PROGRESS
              </span>

              <h2>Overall Course Progress</h2>
            </div>

            <strong>{overallProgress}%</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${overallProgress}%`
              }}
            ></div>
          </div>

          <p>
            Keep learning and complete your enrolled courses
            to improve your overall progress.
          </p>
        </section>

        <section className="dashboard-courses-section">
          <div className="dashboard-section-header">
            <div>
              <span className="details-label">
                YOUR LEARNING
              </span>

              <h2>Enrolled Courses</h2>
            </div>

            <button
              className="text-button"
              onClick={() => navigate("/student-courses")}
            >
              View All
            </button>
          </div>

          {studentCourses.length === 0 ? (
            <div className="dashboard-empty">
              <h3>No Courses Enrolled</h3>

              <p>
                Start your learning journey by exploring the
                available courses.
              </p>

              <button
                className="primary-button"
                onClick={() => navigate("/courses")}
              >
                Explore Courses
              </button>
            </div>
          ) : (
            <div className="dashboard-course-list">
              {studentCourses.map((course) => (
                <article
                  className="dashboard-course-item"
                  key={course.id}
                >
                  <div className="dashboard-course-info">
                    <span>
                      COURSE{" "}
                      {String(course.courseId).padStart(2, "0")}
                    </span>

                    <h3>{course.course}</h3>

                    <p>
                      {course.level} · {course.duration}
                    </p>
                  </div>

                  <div className="dashboard-course-progress">
                    <div className="dashboard-progress-heading">
                      <span>Progress</span>

                      <strong>
                        {course.progress || 0}%
                      </strong>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${course.progress || 0}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <button
                    className="primary-button"
                    onClick={() =>
                      navigate("/enrollment", {
                        state: {
                          course: {
                            id: course.courseId,
                            title: course.course,
                            level: course.level,
                            duration: course.duration,
                            description:
                              "Continue learning and track your progress in this course."
                          }
                        }
                      })
                    }
                  >
                    View Course
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-logout-section">
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

export default StudentDashboard;