import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useCourses } from "../context/CourseContext";
import { useStudents } from "../context/StudentContext";
import PageShell from "../components/PageShell";

function StudentCourses() {
  const navigate = useNavigate();

  const { loggedInStudent } = useAuth();

  const {
    courses,
    loading: courseLoading
  } = useCourses();

  const {
    enrollments,
    loading: enrollmentLoading
  } = useStudents();

  if (!loggedInStudent) {
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

  if (courseLoading || enrollmentLoading) {
    return <p>Loading courses...</p>;
  }

  const myEnrollments = enrollments.filter(
    (item) =>
      String(item.studentId) ===
      String(loggedInStudent.id)
  );

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
            <strong>{myEnrollments.length}</strong>
            <span>Enrolled Courses</span>
          </div>
        </section>

        {myEnrollments.length === 0 ? (
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
            {myEnrollments.map((enrollment) => {
              const course = courses.find(
                (item) =>
                  String(item.id) ===
                  String(enrollment.courseId)
              );

              return (
                <article
                  className="student-course-card"
                  key={enrollment.id}
                >
                  <div className="student-course-top">
                    <span>
                      COURSE{" "}
                      {String(
                        enrollment.courseId
                      ).padStart(2, "0")}
                    </span>

                    <span>
                      {enrollment.status ||
                        "In Progress"}
                    </span>
                  </div>

                  <h2>
                    {course?.courseName || "Course"}
                  </h2>

                  <p>
                    {course?.overview ||
                      "Continue learning and develop your skills through this course."}
                  </p>

                  <div className="student-course-info">
                    <div>
                      <span>Level</span>
                      <strong>
                        {course?.level || "N/A"}
                      </strong>
                    </div>

                    <div>
                      <span>Duration</span>
                      <strong>
                        {course?.duration || "N/A"}
                      </strong>
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
                      <span>
                        Learning Progress
                      </span>

                      <strong>
                        {enrollment.progress || 0}%
                      </strong>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${
                            enrollment.progress || 0
                          }%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <button
                    className="primary-button student-course-button"
                    onClick={() =>
                      navigate("/enrollment", {
                        state: {
                          course,
                          enrollment
                        }
                      })
                    }
                  >
                    View Enrollment
                  </button>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </PageShell>
  );
}

export default StudentCourses;