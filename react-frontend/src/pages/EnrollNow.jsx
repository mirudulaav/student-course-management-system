import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useStudents } from "../context/StudentContext";
import PageShell from "../components/PageShell";

function EnrollNow() {
  const location = useLocation();
  const navigate = useNavigate();

  const { loggedInStudent } = useAuth();
  const { enroll } = useStudents();

  const course = location.state?.course;

  async function handleEnroll() {
    if (!loggedInStudent || !course) {
      return;
    }

    try {
      const newEnrollment = await enroll(
        loggedInStudent.id,
        course.id
      );

      navigate("/enrollment", {
        state: {
          course,
          enrollment: newEnrollment
        }
      });
    } catch (error) {
      console.error(error);
      alert("Unable to enroll in this course.");
    }
  }

  if (!course) {
    return (
      <PageShell>
        <main className="container">
          <div className="empty-state">
            <h1>Course Not Found</h1>

            <p>
              Please return to the courses page and select a course.
            </p>

            <button
              className="primary-button"
              onClick={() => navigate("/courses")}
            >
              Back to Courses
            </button>
          </div>
        </main>
      </PageShell>
    );
  }

  if (!loggedInStudent) {
    return (
      <PageShell>
        <main className="enroll-page">
          <div className="enroll-card">
            <span className="details-label">
              LOGIN REQUIRED
            </span>

            <h1>Login to Enroll</h1>

            <p>
              You need to login as a student before enrolling
              in this course.
            </p>

            <div className="enroll-course-preview">
              <span>COURSE</span>

              <h2>{course.courseName}</h2>

              <p>{course.overview}</p>
            </div>

            <button
              className="primary-button enroll-button"
              onClick={() => navigate("/login")}
            >
              Login as Student
            </button>

            <button
              className="back-button enroll-back"
              onClick={() => navigate("/courses")}
            >
              ← Back to Courses
            </button>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="enroll-page">
        <section className="enroll-card">
          <button
            className="back-button"
            onClick={() =>
              navigate("/course-details", {
                state: { course }
              })
            }
          >
            ← Back to Course
          </button>

          <div className="enroll-header">
            <span className="details-label">
              COURSE ENROLLMENT
            </span>

            <h1>Enroll in This Course</h1>

            <p>
              Confirm your course details and start your
              learning journey.
            </p>
          </div>

          <div className="enroll-course-preview">
            <div className="enroll-course-top">
              <span>
                COURSE{" "}
                {String(course.id).padStart(2, "0")}
              </span>

              <span>{course.level}</span>
            </div>

            <h2>{course.courseName}</h2>

            <p>{course.overview}</p>

            <div className="enroll-course-meta">
              <div>
                <span>Duration</span>

                <strong>{course.duration}</strong>
              </div>

              <div>
                <span>Level</span>

                <strong>{course.level}</strong>
              </div>

              <div>
                <span>Student</span>

                <strong>
                  {loggedInStudent.name}
                </strong>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEnroll();
            }}
          >
            <div className="enroll-confirmation">
              <h3>Ready to begin?</h3>

              <p>
                By enrolling, this course will be added to your
                student dashboard and your learning progress
                will start at 0%.
              </p>
            </div>

            <button
              type="submit"
              className="primary-button enroll-submit"
            >
              Confirm Enrollment
            </button>
          </form>
        </section>
      </main>
    </PageShell>
  );
}

export default EnrollNow;