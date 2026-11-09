import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import EnrollNow from "./pages/EnrollNow";
import Enrollment from "./pages/Enrollment";
import StudentCourses from "./pages/StudentCourses";
import AdminDashboard from "./pages/AdminDashboard";
import Students from "./pages/Students";
import Reports from "./pages/Reports";
import LearningProgress from "./pages/LearningProgress";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/course-details" element={<CourseDetails />} />
      <Route path="/enroll-now" element={<EnrollNow />} />
      <Route path="/enrollment" element={<Enrollment />} />
      <Route path="/student-courses" element={<StudentCourses />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/students" element={<Students />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/learning-progress" element={<LearningProgress />} />

    </Routes>
  );
}

export default App;