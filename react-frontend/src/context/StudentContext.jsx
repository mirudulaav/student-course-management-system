import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import api from "../services/api";
import { useAuth } from "../auth/AuthContext";

const StudentContext = createContext(null);

function getRecords(response, resource) {
  const records = Array.isArray(response.data)
    ? response.data
    : response.data?.data;

  if (!Array.isArray(records)) {
    throw new Error(`Expected ${resource} response to be an array.`);
  }

  return records;
}

export function StudentProvider({ children }) {
  const { loggedInStudent, loggedInAdmin } = useAuth();
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = useCallback(async () => {
    const response = await api.get("/students");
    setStudents(getRecords(response, "students"));
  }, []);

  const fetchEnrollments = useCallback(async () => {
    const response = await api.get("/enrollments");
    setEnrollments(getRecords(response, "enrollments"));
  }, []);

  const fetchData = useCallback(async () => {
    if (!sessionStorage.getItem("token")) {
      setStudents([]);
      setEnrollments([]);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [studentsResult, enrollmentsResult] = await Promise.allSettled([
        fetchStudents(),
        fetchEnrollments()
      ]);

      if (studentsResult.status === "rejected") {
        console.error("Failed to load students:", studentsResult.reason);
        setError("Unable to load student data.");
      }

      if (enrollmentsResult.status === "rejected") {
        console.warn(
          "Optional enrollment data not loaded:",
          enrollmentsResult.reason?.message
        );
      }
    } finally {
      setLoading(false);
    }
  }, [fetchEnrollments, fetchStudents]);

  async function enroll(studentId, courseId) {
    const existingEnrollment = enrollments.find(
      (item) =>
        String(item.studentId) === String(studentId) &&
        String(item.courseId) === String(courseId)
    );

    if (existingEnrollment) return existingEnrollment;

    const response = await api.post("/enrollments", {
      courseId: String(courseId)
    });

    setEnrollments((current) => [...current, response.data]);
    return response.data;
  }

  async function unenroll(courseId) {
    await api.delete(`/enrollments/${courseId}`);
    setEnrollments((current) =>
      current.filter((item) => String(item.courseId) !== String(courseId))
    );
  }

  useEffect(() => {
    fetchData();
  }, [fetchData, loggedInStudent, loggedInAdmin]);

  return (
    <StudentContext.Provider
      value={{
        students,
        enrollments,
        loading,
        error,
        fetchData,
        enroll,
        unenroll
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  return useContext(StudentContext);
}