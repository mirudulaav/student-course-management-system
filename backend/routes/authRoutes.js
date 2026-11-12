const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const { registerValidation, loginValidation } = require("../validators/authValidators");
const validateRequest = require("../middleware/validateRequest");
const loginLimiter = require("../middleware/loginLimiter");

router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginLimiter, loginValidation, validateRequest, login);

module.exports = router;