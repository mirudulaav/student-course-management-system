import { Link, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import { useCourses } from "../context/CourseContext";

function CourseCard({ course, isAdmin, onDelete }) {
  const navigate = useNavigate();

  return (
    <article className="course-item">
      <div className="course-item-top">
        <span className="course-index">
          {course.courseCode}
        </span>
        <span className="course-level">{course.level}</span>
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
            navigate("/course-details", { state: { course } })
          }
        >
          View Course
        </button>
      </div>

      {/* Admin action buttons moved to their own row below the footer */}
      {isAdmin && (
        <div
          style={{
            display: "flex",
            gap: "20px",
            padding: "20px 24px 20px"
          }}
        >
          <Link
            to={`/edit-course/${course.id}`}
            className="primary-button"
            style={{ textAlign: "center", flex: 1, textDecoration: "none" }}
          >
            Edit
          </Link>
          <button
            type="button"
            className="primary-button"
            style={{ flex: 1 }}
            onClick={() => onDelete(course.id)}
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}

function Courses() {
  const { courses, loading, error, deleteCourse } = useCourses();
  const role = sessionStorage.getItem("role");
  const isAdmin = role === "admin";

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }
    try {
      await deleteCourse(id);
      alert("Course deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Unable to delete course.");
    }
  }

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

            {isAdmin && (
              <Link to="/add-course" className="primary-button" style={{ textDecoration: "none" }}>
                Add Course
              </Link>
            )}
          </div>

          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isAdmin={isAdmin}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}

export default Courses;