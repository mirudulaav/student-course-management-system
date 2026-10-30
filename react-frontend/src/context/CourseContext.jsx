
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
      setCourses(response.data.data);
      setError("");
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setError("Unable to load courses.");
    } finally {
      setLoading(false);
    }
  }

  async function addCourse(course) {
    try {
      const response = await api.post("/courses", course);
      const newCourse = response.data.data;
      setCourses((current) => [...current, newCourse]);
      return newCourse;
    } catch (error) {
      console.error("Error adding course:", error);
      throw error;
    }
  }

  async function updateCourse(id, course) {
    try {
      const response = await api.put(`/courses/${id}`, course);
      const updatedCourse = response.data.data;

      setCourses((current) =>
        current.map((item) =>
          String(item.id) === String(id) ? updatedCourse : item
        )
      );

      return updatedCourse;
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  }

  async function deleteCourse(id) {
    try {
      await api.delete(`/courses/${id}`);

      setCourses((current) =>
        current.filter((item) => String(item.id) !== String(id))
      );
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
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
