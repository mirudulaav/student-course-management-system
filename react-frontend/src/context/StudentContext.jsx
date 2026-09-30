import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import api from "../services/api";

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchStudents() {
    const response = await api.get("/students");
    setStudents(response.data);
  }

  async function fetchEnrollments() {
    const response = await api.get("/enrollments");
    setEnrollments(response.data);
  }

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      await Promise.all([
        fetchStudents(),
        fetchEnrollments()
      ]);
    } catch (error) {
      console.error(error);
      setError("Unable to load student data.");
    } finally {
      setLoading(false);
    }
  }

  async function enroll(studentId, courseId) {
    const existingEnrollment = enrollments.find(
      (item) =>
        String(item.studentId) === String(studentId) &&
        String(item.courseId) === String(courseId)
    );

    if (existingEnrollment) {
      return existingEnrollment;
    }

    const newEnrollment = {
      studentId: String(studentId),
      courseId: String(courseId),
      status: "Enrolled",
      progress: 0
    };

    const response = await api.post(
      "/enrollments",
      newEnrollment
    );

    setEnrollments((current) => [
      ...current,
      response.data
    ]);

    return response.data;
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <StudentContext.Provider
      value={{
        students,
        enrollments,
        loading,
        error,
        fetchData,
        enroll
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  return useContext(StudentContext);
}