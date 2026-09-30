import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedInStudent, setLoggedInStudent] = useState(
    JSON.parse(localStorage.getItem("loggedInStudent")) || null
  );

  const [loggedInAdmin, setLoggedInAdmin] = useState(
    JSON.parse(localStorage.getItem("loggedInAdmin")) || null
  );

  const loginStudent = (studentData) => {
    setLoggedInStudent(studentData);
    localStorage.setItem("loggedInStudent", JSON.stringify(studentData));
  };

  const loginAdmin = (adminData) => {
    setLoggedInAdmin(adminData);
    localStorage.setItem("loggedInAdmin", JSON.stringify(adminData));
  };

  const logoutStudent = () => {
    setLoggedInStudent(null);
    localStorage.removeItem("loggedInStudent");
  };

  const logoutAdmin = () => {
    setLoggedInAdmin(null);
    localStorage.removeItem("loggedInAdmin");
  };

  return (
    <AuthContext.Provider
      value={{
        student: loggedInStudent,
        admin: loggedInAdmin,
        loggedInStudent,
        loggedInAdmin,
        loginStudent,
        loginAdmin,
        logoutStudent,
        logoutAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);