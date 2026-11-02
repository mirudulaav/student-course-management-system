const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { validateRegistration } = require("../middleware/authValidation");
const validateStudentUpdate = require("../middleware/studentValidation");
const User = require("../models/User");
const {
    createStudent,
    getStudent,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

const router = express.Router();

function requireStudentOwner(req, res, next) {
    if (String(req.user.id) !== String(req.params.id)) {
        return res.status(403).json({
            success: false,
            message: "You can only manage your own student account"
        });
    }

    next();
}

router.post("/", validateRegistration, createStudent);
router.get("/", authMiddleware, async (req, res, next) => {
    try {
        const filter =
            req.user.role === "admin"
                ? { role: "student" }
                : { _id: req.user.id, role: "student" };

        const students = await User.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: students.length,
            data: students.map((student) => ({
                id: String(student._id),
                name: student.name,
                email: student.email,
                department: student.department,
                role: student.role
            }))
        });
    } catch (error) {
        next(error);
    }
});
router.get("/:id", authMiddleware, requireStudentOwner, getStudent);
router.put("/:id", authMiddleware, requireStudentOwner, validateStudentUpdate(true), updateStudent);
router.patch("/:id", authMiddleware, requireStudentOwner, validateStudentUpdate(false), updateStudent);
router.delete("/:id", authMiddleware, requireStudentOwner, deleteStudent);

module.exports = router;
