import { useLocation, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";

function CourseDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const course = location.state?.course;

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

  return (
    <PageShell>
      <main className="course-details-page">

        <section className="course-details-hero">

          <div className="course-details-hero-content">

            <button
              className="back-button"
              onClick={() => navigate("/courses")}
            >
              ← Back to Courses
            </button>

            <span className="course-details-number">
              COURSE {String(course.id).padStart(2, "0")}
            </span>

            <h1>{course.title}</h1>

            <p>
              {course.description}
            </p>

            <div className="course-meta">

              <div>
                <span>Level</span>
                <strong>{course.level}</strong>
              </div>

              <div>
                <span>Duration</span>
                <strong>{course.duration}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>Available</strong>
              </div>

            </div>

          </div>

        </section>

        <section className="course-details-container">

          <div className="course-details-main">

            <div className="details-card">

              <span className="details-label">
                COURSE OVERVIEW
              </span>

              <h2>About This Course</h2>

              <p>
                This course is designed to help students develop
                practical knowledge and understanding of
                {` ${course.title}`}.
              </p>

              <p>
                Students can build their knowledge step by step
                while learning important concepts and applying
                them through practical learning activities.
              </p>

            </div>

            <div className="details-card">

              <span className="details-label">
                WHAT YOU WILL LEARN
              </span>

              <h2>Learning Outcomes</h2>

              <ul className="learning-list">
                <li>Understand fundamental concepts</li>
                <li>Learn important techniques and methods</li>
                <li>Apply concepts to practical problems</li>
                <li>Develop technical problem-solving skills</li>
                <li>Build a strong foundation in the subject</li>
              </ul>

            </div>

          </div>

          <aside className="course-enroll-card">

            <span className="details-label">
              START LEARNING
            </span>

            <h2>{course.title}</h2>

            <p>
              Enroll in this course and begin tracking your
              learning progress.
            </p>

            <div className="enroll-info">

              <div>
                <span>Course Level</span>
                <strong>{course.level}</strong>
              </div>

              <div>
                <span>Duration</span>
                <strong>{course.duration}</strong>
              </div>

            </div>

            <button
              className="primary-button enroll-button"
              onClick={() =>
                navigate("/enroll-now", {
                  state: { course }
                })
              }
            >
              Enroll Now
            </button>

          </aside>

        </section>

      </main>
    </PageShell>
  );
}
export default CourseDetails;