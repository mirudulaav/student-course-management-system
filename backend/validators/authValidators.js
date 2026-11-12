const { body } = require("express-validator");

const registerValidation = [
  body("name")
    .isString().withMessage("Name must be text")
    .bail()
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ max: 100 }).withMessage("Name must be at most 100 characters"),
  body("email")
    .isString().withMessage("Email must be text")
    .bail()
    .trim()
    .isEmail().withMessage("Enter a valid email address")
    .isLength({ max: 254 }).withMessage("Email must be at most 254 characters"),
  body("password")
    .isString().withMessage("Password must be text")
    .bail()
    .isLength({ min: 12, max: 72 })
    .withMessage("Password must be between 12 and 72 characters"),
  body("department")
    .isString().withMessage("Department must be text")
    .bail()
    .trim()
    .notEmpty().withMessage("Department is required")
    .isLength({ max: 100 })
    .withMessage("Department must be at most 100 characters")
];

const loginValidation = [
  body("email")
    .isString().withMessage("Email must be text")
    .bail()
    .trim()
    .isEmail().withMessage("Enter a valid email address")
    .isLength({ max: 254 }).withMessage("Email must be at most 254 characters"),
  body("password")
    .isString().withMessage("Password must be text")
    .bail()
    .isLength({ min: 12, max: 72 })
    .withMessage("Password must be between 12 and 72 characters")
];

module.exports = { registerValidation, loginValidation };
