const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { registerValidation } = require("../validators/authValidators");
const {
    studentIdValidation,
    studentUpdateValidation
} = require("../validators/studentValidators");
const paginationValidation = require("../validators/paginationValidators");
const validateRequest = require("../middleware/validateRequest");
const getPagination = require("../utils/pagination");
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

router.post("/", registerValidation, validateRequest, createStudent);
router.get("/", authMiddleware, paginationValidation, validateRequest, async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req.query);
        const filter =
            req.user.role === "admin"
                ? { role: "student" }
                : { _id: req.user.id, role: "student" };

        const [students, total] = await Promise.all([
            User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            User.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            count: students.length,
            total,
            page,
            limit,
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
router.get(
    "/:id",
    authMiddleware,
    studentIdValidation,
    validateRequest,
    requireStudentOwner,
    getStudent
);
router.put(
    "/:id",
    authMiddleware,
    studentIdValidation,
    studentUpdateValidation(true),
    validateRequest,
    requireStudentOwner,
    updateStudent
);
router.patch(
    "/:id",
    authMiddleware,
    studentIdValidation,
    studentUpdateValidation(false),
    validateRequest,
    requireStudentOwner,
    updateStudent
);
router.delete(
    "/:id",
    authMiddleware,
    studentIdValidation,
    validateRequest,
    requireStudentOwner,
    deleteStudent
);

module.exports = router;
