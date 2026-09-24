import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";

function StudentCourses() {
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

  function viewCourse(enrollment) {
    const course = {
      id: enrollment.courseId,
      title: enrollment.course,
      level: enrollment.level,
      duration: enrollment.duration,
      description:
        "Continue learning and track your progress in this course."
    };

    navigate("/enrollment", {
      state: { course }
    });
  }

  if (!student) {
    return (
      <PageShell>
        <main className="container">
          <div className="empty-state">
            <h1>Login Required</h1>
            <p>
              Please login as a student to view your courses.
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
      <main className="student-courses-page">
        <section className="student-courses-header">
          <div>
            <span className="details-label">
              MY LEARNING
            </span>

            <h1>My Courses</h1>

            <p>
              View your enrolled courses and continue your
              learning journey.
            </p>
          </div>

          <div className="my-course-count">
            <strong>{studentCourses.length}</strong>
            <span>Enrolled Courses</span>
          </div>
        </section>

        {studentCourses.length === 0 ? (
          <section className="student-courses-empty">
            <span className="details-label">
              NO COURSES YET
            </span>

            <h2>Start Your Learning Journey</h2>

            <p>
              You have not enrolled in any courses yet.
              Explore the available courses and choose one
              to get started.
            </p>

            <button
              className="primary-button"
              onClick={() => navigate("/courses")}
            >
              Explore Courses
            </button>
          </section>
        ) : (
          <section className="student-course-grid">
            {studentCourses.map((enrollment) => (
              <article
                className="student-course-card"
                key={enrollment.id}
              >
                <div className="student-course-top">
                  <span>
                    COURSE{" "}
                    {String(enrollment.courseId).padStart(2, "0")}
                  </span>

                  <span>
                    {enrollment.status || "In Progress"}
                  </span>
                </div>

                <h2>{enrollment.course}</h2>

                <p>
                  {enrollment.description ||
                    "Continue learning and develop your skills through this course."}
                </p>

                <div className="student-course-info">
                  <div>
                    <span>Level</span>
                    <strong>{enrollment.level}</strong>
                  </div>

                  <div>
                    <span>Duration</span>
                    <strong>{enrollment.duration}</strong>
                  </div>

                  <div>
                    <span>Progress</span>
                    <strong>
                      {enrollment.progress || 0}%
                    </strong>
                  </div>
                </div>

                <div className="student-progress">
                  <div className="student-progress-heading">
                    <span>Learning Progress</span>
                    <strong>
                      {enrollment.progress || 0}%
                    </strong>
                  </div>

                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${enrollment.progress || 0}%`
                      }}
                    ></div>
                  </div>
                </div>

                <button
                  className="primary-button student-course-button"
                  onClick={() => viewCourse(enrollment)}
                >
                  View Enrollment
                </button>
              </article>
            ))}
          </section>
        )}
      </main>
    </PageShell>
  );
}

export default StudentCourses;