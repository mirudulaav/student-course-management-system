import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const CourseContext = createContext(null);

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchCourses() {
    try {
      setLoading(true);
      const response = await api.get("/courses");
      setCourses(response.data);
      setError("");
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setError("Unable to load courses.");
    } finally {
      setLoading(false);
    }
  }

  async function addCourse(course) {
    const response = await api.post("/courses", course);
    setCourses((current) => [...current, response.data]);
    return response.data;
  }

  async function updateCourse(id, course) {
    const response = await api.put(`/courses/${id}`, course);

    setCourses((current) =>
      current.map((item) =>
        String(item.id) === String(id) ? response.data : item
      )
    );

    return response.data;
  }

  async function deleteCourse(id) {
    await api.delete(`/courses/${id}`);

    setCourses((current) =>
      current.filter((item) => String(item.id) !== String(id))
    );
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <CourseContext.Provider
      value={{
        courses,
        loading,
        error,
        fetchCourses,
        addCourse,
        updateCourse,
        deleteCourse
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  return useContext(CourseContext);
}