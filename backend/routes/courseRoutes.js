const express = require("express");
const {
    getCourses,
    getCourse,
    addCourse,
    editCourse,
    removeCourse
} = require("../controllers/courseController");

const {
    courseIdValidation,
    courseCreateValidation,
    courseUpdateValidation,
    coursePatchValidation
} = require("../validators/courseValidators");
const paginationValidation = require("../validators/paginationValidators");
const validateRequest = require("../middleware/validateRequest");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", paginationValidation, validateRequest, getCourses);
router.get("/:id", courseIdValidation, validateRequest, getCourse);

router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    courseCreateValidation,
    validateRequest,
    addCourse
);
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    courseIdValidation,
    courseUpdateValidation,
    validateRequest,
    editCourse
);
router.patch(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    courseIdValidation,
    coursePatchValidation,
    validateRequest,
    editCourse
);
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    courseIdValidation,
    validateRequest,
    removeCourse
);

module.exports = router;