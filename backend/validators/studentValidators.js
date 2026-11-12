const { body, param } = require("express-validator");

const studentIdValidation = [
  param("id").isMongoId().withMessage("Student ID must be a valid MongoDB ID")
];

function studentUpdateValidation(requireAllFields) {
  const fields = ["name", "email", "department"];
  const checks = [
    body().custom((value) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new Error("Student details must be an object");
      }

      const keys = Object.keys(value);
      if (
        keys.length === 0 ||
        keys.some((field) => !fields.includes(field)) ||
        (requireAllFields && fields.some((field) => !(field in value)))
      ) {
        throw new Error("Provide valid name, email, and department fields");
      }

      return true;
    })
  ];

  for (const field of fields) {
    const validator = body(field);
    if (!requireAllFields) {
      validator.optional();
    }

    checks.push(
      validator
        .isString().withMessage(`${field} must be text`)
        .bail()
        .trim()
        .notEmpty().withMessage(`${field} is required`)
        .isLength({ max: field === "email" ? 254 : 100 })
        .withMessage(`${field} is too long`)
    );
  }

  checks.push(
    body("email")
      .optional()
      .isEmail()
      .withMessage("Enter a valid email address")
  );

  return checks;
}

module.exports = { studentIdValidation, studentUpdateValidation };
