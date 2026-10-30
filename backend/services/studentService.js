const students = require("../data/students");

function toPublicStudent({ passwordHash, ...student }) {
    return student;
}

function getAllStudents() {
    return students.map(toPublicStudent);
}

function getStudentById(id) {
    const student = students.find(item => String(item.id) === String(id));
    return student ? toPublicStudent(student) : null;
}

function updateStudent(id, changes) {
    const student = students.find(item => String(item.id) === String(id));
    if (!student) return null;

    if (changes.email) {
        const normalizedEmail = changes.email.trim().toLowerCase();
        const duplicate = students.some(
            item => item.id !== student.id && item.email === normalizedEmail
        );

        if (duplicate) {
            const error = new Error("Email is already registered");
            error.statusCode = 409;
            throw error;
        }

        student.email = normalizedEmail;
    }

    for (const field of ["name", "department"]) {
        if (changes[field] !== undefined) {
            student[field] = changes[field].trim();
        }
    }

    return toPublicStudent(student);
}

function deleteStudent(id) {
    const index = students.findIndex(item => String(item.id) === String(id));
    if (index === -1) return false;

    students.splice(index, 1);
    return true;
}

module.exports = {
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};
