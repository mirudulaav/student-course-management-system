import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";

function Students() {
  const navigate = useNavigate();

  const students = JSON.parse(
    sessionStorage.getItem("students") || "[]"
  );

  const loggedInAdmin = JSON.parse(
    sessionStorage.getItem("loggedInAdmin") || "null"
  );

  if (!loggedInAdmin) {
    return (
      <PageShell>
        <main className="container">
          <div className="empty-state">
            <h1>Admin Login Required</h1>
            <p>
              Please login as an administrator to manage students.
            </p>
            <button
              className="primary-button"
              onClick={() => navigate("/login")}
            >
              Login as Admin
            </button>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="students-page">
        <section className="students-header">
          <div>
            <span className="details-label">
              STUDENT MANAGEMENT
            </span>

            <h1>Registered Students</h1>

            <p>
              View student information registered in the
              Student Course Management System.
            </p>
          </div>

          <div className="student-count">
            <strong>{students.length}</strong>
            <span>Total Students</span>
          </div>
        </section>

        <section className="students-table-section">
          <div className="students-table-header">
            <div>
              <h2>Student Records</h2>
              <p>
                All registered student accounts are listed below.
              </p>
            </div>

            <button
              className="secondary-button"
              onClick={() => navigate("/admin-dashboard")}
            >
              ← Dashboard
            </button>
          </div>

          {students.length === 0 ? (
            <div className="students-empty">
              <h3>No Students Registered</h3>
              <p>
                Student records will appear here after students
                create an account.
              </p>
            </div>
          ) : (
            <div className="students-table-wrapper">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date of Birth</th>
                    <th>Gender</th>
                    <th>Course</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student, index) => (
                    <tr key={student.email || index}>
                      <td>
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      <td>
                        <strong>
                          {student.fullname || "Not Available"}
                        </strong>
                      </td>

                      <td>
                        {student.email || "Not Available"}
                      </td>

                      <td>
                        {student.phone || "Not Available"}
                      </td>

                      <td>
                        {student.dob || "Not Available"}
                      </td>

                      <td>
                        {student.gender || "Not Available"}
                      </td>

                      <td>
                        {student.course || "Not Available"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </PageShell>
  );
}

export default Students;