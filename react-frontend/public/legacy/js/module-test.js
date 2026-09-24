import {
    getCurrentStudent,
    getCurrentAdmin,
    isStudentLoggedIn,
    isAdminLoggedIn,
    logout
} from "./auth.js";

import {
    show,
    hide,
    setText,
    showMessage
} from "./ui.js";

console.log("Authentication module loaded");
console.log("Student:", getCurrentStudent());
console.log("Admin:", getCurrentAdmin());
console.log("Student logged in:", isStudentLoggedIn());
console.log("Admin logged in:", isAdminLoggedIn());