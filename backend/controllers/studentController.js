const studentService = require("../services/studentService");
const { registerStudent } = require("../services/authService");

async function createStudent(req, res, next) {
    try {
        const student = await registerStudent(req.body);
        res.status(201).json({
            success: true,
            message: "Student registered successfully",
            student
        });
    } catch (error) {
        next(error);
    }
}

function getStudents(req, res) {
    const students = studentService.getAllStudents();
    res.status(200).json({
        success: true,
        count: students.length,
        data: students
    });
}

function getStudent(req, res) {
    const student = studentService.getStudentById(req.params.id);
    if (!student) {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }

    res.status(200).json({ success: true, data: student });
}

function updateStudent(req, res, next) {
    try {
        const student = studentService.updateStudent(req.params.id, req.body);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: student
        });
    } catch (error) {
        next(error);
    }
}

function deleteStudent(req, res) {
    if (!studentService.deleteStudent(req.params.id)) {
        return res.status(404).json({
            success: false,
            message: "Student not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Student deleted successfully"
    });
}

module.exports = {
    createStudent,
    getStudents,
    getStudent,
    updateStudent,
    deleteStudent
};
