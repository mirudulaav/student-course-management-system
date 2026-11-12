const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const {
  updateProgress,
  getMyProgress
} = require("../controllers/learningProgressController");
const paginationValidation = require("../validators/paginationValidators");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.get(
  "/my-progress",
  authMiddleware,
  authorizeRoles("student"),
  paginationValidation,
  validateRequest,
  getMyProgress
);
router.put("/", authMiddleware, authorizeRoles("student"), updateProgress);

module.exports = router;
