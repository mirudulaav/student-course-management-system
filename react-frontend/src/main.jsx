import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { CourseProvider } from "./context/CourseContext";
import { StudentProvider } from "./context/StudentContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StudentProvider>
          <CourseProvider>
            <App />
          </CourseProvider>
        </StudentProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);