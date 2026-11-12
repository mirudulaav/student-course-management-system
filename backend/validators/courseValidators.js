const { body, param } = require("express-validator");

const courseFields = {
  courseName: 120,
  courseCode: 50,
  instructor: 120,
  duration: 50,
  category: 100,
  level: 50,
  image: 2048,
  status: 30,
  overview: 5000
};
const requiredFields = [
  "courseName",
  "courseCode",
  "instructor",
  "duration",
  "category"
];

const courseIdValidation = [
  param("id").isMongoId().withMessage("Course ID must be a valid MongoDB ID")
];

function courseBodyValidation(requireAllFields) {
  const checks = [
    body().custom((value) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new Error("Course details must be an object");
      }

      const keys = Object.keys(value);
      if (
        keys.length === 0 ||
        keys.some((field) => !Object.prototype.hasOwnProperty.call(courseFields, field)) ||
        (requireAllFields &&
          requiredFields.some((field) => !Object.prototype.hasOwnProperty.call(value, field)))
      ) {
        throw new Error("Provide valid course fields");
      }

      return true;
    })
  ];

  for (const [field, maxLength] of Object.entries(courseFields)) {
    const validator = body(field);
    if (!requireAllFields || !requiredFields.includes(field)) {
      validator.optional();
    }

    if (field === "duration") {
      checks.push(
        validator.custom((value) =>
          (typeof value === "string" &&
            value.trim().length > 0 &&
            value.trim().length <= maxLength) ||
          (typeof value === "number" && Number.isFinite(value) && value > 0)
        ).withMessage("Duration must be a non-empty string or positive number")
      );
    } else {
      checks.push(
        validator
          .isString().withMessage(`${field} must be text`)
          .bail()
          .trim()
          .notEmpty().withMessage(`${field} is required`)
          .isLength({ max: maxLength })
          .withMessage(`${field} must be at most ${maxLength} characters`)
      );
    }
  }

  return checks;
}

module.exports = {
  courseIdValidation,
  courseCreateValidation: courseBodyValidation(true),
  courseUpdateValidation: courseBodyValidation(true),
  coursePatchValidation: courseBodyValidation(false)
};
