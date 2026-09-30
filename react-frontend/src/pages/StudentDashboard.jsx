import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useStudents } from "../context/StudentContext";
import { useCourses } from "../context/CourseContext";
import PageShell from "../components/PageShell";

function StudentDashboard() {
  const navigate = useNavigate();

  const {
    loggedInStudent,
    logoutStudent
  } = useAuth();

  const {
    students,
    enrollments,
    loading: studentLoading,
    error: studentError
  } = useStudents();

  const {
    courses,
    loading: courseLoading,
    error: courseError
  } = useCourses();

  if (studentLoading || courseLoading) {
    return <p>Loading dashboard...</p>;
  }

  if (studentError || courseError) {
    return <p>{studentError || courseError}</p>;
  }

  if (!loggedInStudent) {
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

  const student = students.find(
    (item) =>
      String(item.id) === String(loggedInStudent.id)
  );

  if (!student) {
    return (
      <PageShell>
        <main className="container">
          <div className="empty-state">
            <h1>Student Not Found</h1>

            <p>
              Your student account could not be found.
            </p>
          </div>
        </main>
      </PageShell>
    );
  }

  const studentEnrollments = enrollments.filter(
    (item) =>
      String(item.studentId) === String(student.id)
  );

  const enrolledCourses = studentEnrollments.map(
    (enrollment) => {
      const course = courses.find(
        (item) =>
          String(item.id) ===
          String(enrollment.courseId)
      );

      return {
        ...enrollment,
        course
      };
    }
  );

  const totalCourses = studentEnrollments.length;

  const completedCourses =
    studentEnrollments.filter(
      (item) => item.status === "Completed"
    ).length;

  const overallProgress =
    totalCourses > 0
      ? Math.round(
          studentEnrollments.reduce(
            (total, item) =>
              total + Number(item.progress || 0),
            0
          ) / totalCourses
        )
      : 0;

  function logout() {
    logoutStudent();
    navigate("/login");
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
              Welcome, {student.name}
            </h1>

            <p>{student.email}</p>

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
              onClick={() =>
                navigate("/student-courses")
              }
            >
              View All
            </button>
          </div>

          {enrolledCourses.length === 0 ? (
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
              {enrolledCourses.map((item) => (
                <article
                  className="dashboard-course-item"
                  key={item.id}
                >
                  <div className="dashboard-course-info">
                    <span>
                      COURSE{" "}
                      {String(item.courseId).padStart(2, "0")}
                    </span>

                    <h3>
                      {item.course?.courseName ||
                        "Course"}
                    </h3>

                    <p>
                      {item.course?.level || "N/A"} ·{" "}
                      {item.course?.duration || "N/A"}
                    </p>
                  </div>

                  <div className="dashboard-course-progress">
                    <div className="dashboard-progress-heading">
                      <span>Progress</span>

                      <strong>
                        {item.progress || 0}%
                      </strong>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${item.progress || 0}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <button
                    className="primary-button"
                    onClick={() =>
                      navigate("/enrollment", {
                        state: {
                          course: item.course,
                          enrollment: item
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