const express = require("express");
const {
    getCourses,
    getCourse,
    addCourse,
    editCourse,
    removeCourse
} = require("../controllers/courseController");

const {
    validateCourse,
    validateCoursePatch
} = require("../middleware/courseValidation");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourse);

router.post("/", authMiddleware, validateCourse, addCourse);
router.put("/:id", authMiddleware, validateCourse, editCourse);
router.patch("/:id", authMiddleware, validateCoursePatch, editCourse);
router.delete("/:id", authMiddleware, removeCourse);

module.exports = router;