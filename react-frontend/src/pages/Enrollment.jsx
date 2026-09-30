import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import PageShell from "../components/PageShell";

function Enrollment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { loggedInStudent } = useAuth();

  const course = location.state?.course;
  const enrollment = location.state?.enrollment;

  if (!course) {
    return (
      <PageShell>
        <main className="container">
          <div className="empty-state">
            <h1>Enrollment Details Not Found</h1>

            <p>
              Please select a course from the courses page.
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

  const progress = Number(
    enrollment?.progress || 0
  );

  const status =
    enrollment?.status || "Enrolled";

  return (
    <PageShell>
      <main className="enrollment-page">
        <section className="enrollment-header">
          <div>
            <span className="details-label">
              ENROLLMENT DETAILS
            </span>

            <h1>{course.courseName}</h1>

            <p>
              View your enrollment information and course details.
            </p>
          </div>

          <button
            className="back-button"
            onClick={() =>
              navigate("/student-dashboard")
            }
          >
            ← Dashboard
          </button>
        </section>

        <section className="enrollment-content">
          <div className="enrollment-main-card">
            <div className="enrollment-status">
              <span>ENROLLMENT STATUS</span>

              <strong>{status}</strong>
            </div>

            <h2>{course.courseName}</h2>

            <p className="enrollment-description">
              {course.overview}
            </p>

            <div className="enrollment-details-grid">
              <div className="detail">
                <span>Student Name</span>

                <strong>
                  {loggedInStudent?.name ||
                    "Student"}
                </strong>
              </div>

              <div className="detail">
                <span>Student Email</span>

                <strong>
                  {loggedInStudent?.email ||
                    "Not available"}
                </strong>
              </div>

              <div className="detail">
                <span>Course Level</span>

                <strong>{course.level}</strong>
              </div>

              <div className="detail">
                <span>Duration</span>

                <strong>{course.duration}</strong>
              </div>

              <div className="detail">
                <span>Progress</span>

                <strong>{progress}%</strong>
              </div>

              <div className="detail">
                <span>Course Status</span>

                <strong>{status}</strong>
              </div>
            </div>

            <div className="enrollment-progress">
              <div className="progress-heading">
                <span>Learning Progress</span>

                <strong>{progress}%</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`
                  }}
                ></div>
              </div>

              <p>
                Continue learning to improve your course
                progress.
              </p>
            </div>
          </div>

          <aside className="enrollment-side-card">
            <span className="details-label">
              COURSE INFORMATION
            </span>

            <h2>Keep Learning</h2>

            <p>
              Continue your learning journey and track your
              progress from your student dashboard.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                navigate("/student-dashboard")
              }
            >
              Go to Dashboard
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                navigate("/student-courses")
              }
            >
              My Courses
            </button>
          </aside>
        </section>
      </main>
    </PageShell>
  );
}

export default Enrollment;