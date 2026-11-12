const { validationResult } = require("express-validator");

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map(({ path, param, msg }) => ({
        field: path || param,
        message: msg
      }))
    });
  }

  next();
}

module.exports = validateRequest;
