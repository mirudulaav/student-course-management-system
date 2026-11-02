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
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourse);

router.post("/", authMiddleware, authorizeRoles("admin"), validateCourse, addCourse);
router.put("/:id", authMiddleware, authorizeRoles("admin"), validateCourse, editCourse);
router.patch("/:id", authMiddleware, authorizeRoles("admin"), validateCoursePatch, editCourse);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), removeCourse);

module.exports = router;