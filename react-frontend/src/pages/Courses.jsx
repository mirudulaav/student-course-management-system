import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import { useCourses } from "../context/CourseContext";

function CourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <article className="course-item">
      <div className="course-item-top">
        <span className="course-index">
          COURSE {String(course.id).padStart(2, "0")}
        </span>

        <span className="course-level">
          {course.level}
        </span>
      </div>

      <div className="course-item-body">
        {course.image && (
          <img
            src={course.image}
            alt={course.courseName}
            style={{
              width: "100%",
              height: "160px",
              objectFit: "cover",
              borderRadius: "12px",
              marginBottom: "18px"
            }}
          />
        )}

        <h3>{course.courseName}</h3>

        <p>{course.overview}</p>
      </div>

      <div className="course-item-footer">
        <span>{course.category}</span>

        <button
          type="button"
          onClick={() =>
            navigate("/course-details", {
              state: { course }
            })
          }
        >
          View Course
        </button>
      </div>
    </article>
  );
}

function Courses() {
  const { courses, loading, error } = useCourses();

  if (loading) {
    return (
      <PageShell>
        <main className="courses-page">
          <p>Loading courses...</p>
        </main>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <main className="courses-page">
          <p>{error}</p>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="courses-page">
        <section className="courses-header">
          <div className="courses-header-content">
            <span className="hero-label">OUR COURSES</span>

            <h1>Explore New Skills</h1>

            <p>
              Learn from real-world projects and build the technical
              confidence you need for your next opportunity.
            </p>
          </div>

          <div className="course-count">
            <strong>{courses.length}</strong>
            <span>Available Courses</span>
          </div>
        </section>

        <section className="courses-container">
          <div className="courses-toolbar">
            <div>
              <h2>Course Catalog</h2>

              <p>
                Choose the learning path that matches your goals.
              </p>
            </div>
          </div>

          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
              />
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}

export default Courses;