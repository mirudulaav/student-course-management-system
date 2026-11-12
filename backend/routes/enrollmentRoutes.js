const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const paginationValidation = require("../validators/paginationValidators");
const validateRequest = require("../middleware/validateRequest");
const {
  enrollCourse,
  getEnrollments,
  getMyCourses,
  unenrollCourse
} = require("../controllers/enrollmentController");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  authorizeRoles("student", "admin"),
  paginationValidation,
  validateRequest,
  getEnrollments
);
router.get(
  "/my-courses",
  authMiddleware,
  authorizeRoles("student"),
  paginationValidation,
  validateRequest,
  getMyCourses
);
router.post("/", authMiddleware, authorizeRoles("student"), enrollCourse);
router.delete("/:courseId", authMiddleware, authorizeRoles("student"), unenrollCourse);

module.exports = router;
