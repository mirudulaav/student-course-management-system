import { useLocation, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";

function EnrollNow() {
  const location = useLocation();
  const navigate = useNavigate();

  const course = location.state?.course;

  const student = JSON.parse(
    sessionStorage.getItem("loggedInStudent") || "null"
  );

  function handleEnroll(e) {
    e.preventDefault();

    if (!student) {
      alert("Please login as a student before enrolling.");
      navigate("/login");
      return;
    }

    const enrollments = JSON.parse(
      sessionStorage.getItem("enrollments") || "[]"
    );

    const alreadyEnrolled = enrollments.some(
      (enrollment) =>
        enrollment.studentEmail === student.email &&
        enrollment.courseId === course.id
    );

    if (alreadyEnrolled) {
      alert("You are already enrolled in this course.");
      navigate("/student-dashboard");
      return;
    }

    const newEnrollment = {
      id: "enr-" + Date.now(),
      studentEmail: student.email,
      studentName: student.fullname,
      courseId: course.id,
      course: course.title,
      level: course.level,
      duration: course.duration,
      enrolledAt: new Date().toLocaleDateString(),
      progress: 0,
      status: "In Progress"
    };

    enrollments.push(newEnrollment);

    sessionStorage.setItem(
      "enrollments",
      JSON.stringify(enrollments)
    );

    alert("Successfully enrolled in the course!");

    navigate("/student-dashboard");
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

  if (!student) {
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
              <h2>{course.title}</h2>
              <p>{course.description}</p>
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
            onClick={() => navigate("/course-details", {
              state: { course }
            })}
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
                COURSE {String(course.id).padStart(2, "0")}
              </span>

              <span>{course.level}</span>
            </div>

            <h2>{course.title}</h2>

            <p>{course.description}</p>

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
                <strong>{student.fullname}</strong>
              </div>
            </div>
          </div>

          <form onSubmit={handleEnroll}>
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