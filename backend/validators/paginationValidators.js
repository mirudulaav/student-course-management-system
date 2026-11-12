const { query } = require("express-validator");

module.exports = [
  query("page")
    .optional()
    .isInt({ min: 1, max: 1000000 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer")
];
