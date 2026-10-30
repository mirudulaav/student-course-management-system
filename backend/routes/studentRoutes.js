const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { validateRegistration } = require("../middleware/authValidation");
const validateStudentUpdate = require("../middleware/studentValidation");
const {
    createStudent,
    getStudents,
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
router.get("/", authMiddleware, getStudents);
router.get("/:id", authMiddleware, requireStudentOwner, getStudent);
router.put("/:id", authMiddleware, requireStudentOwner, validateStudentUpdate(true), updateStudent);
router.patch("/:id", authMiddleware, requireStudentOwner, validateStudentUpdate(false), updateStudent);
router.delete("/:id", authMiddleware, requireStudentOwner, deleteStudent);

module.exports = router;
